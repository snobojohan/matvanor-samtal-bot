
import { useState, useEffect, useCallback } from 'react';
import { useSurvey } from '@/context/SurveyContext';
import { supabase } from '@/integrations/supabase/client';
import { UserResponse, SurveyData, SkipCondition } from '@/types/survey';
import { LOCAL_QUESTIONS } from '@/constants/config';
import { surveyQuestions } from '@/data/survey';

interface ChatMessage {
  type: 'bot' | 'user';
  content: string;
}

export const useChat = () => {
  const [currentQuestion, setCurrentQuestion] = useState<string>('welcome');
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [isTyping, setIsTyping] = useState(false);
  const [questions, setQuestions] = useState<SurveyData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnswerAnimating, setIsAnswerAnimating] = useState(false);
  const { addResponse, responses } = useSurvey();

  useEffect(() => {
    if (LOCAL_QUESTIONS) {
      setQuestions(surveyQuestions);
      setIsLoading(false);
    } else {
      loadActiveConfiguration();
    }
  }, []);

  const loadActiveConfiguration = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('survey_configurations')
        .select('questions')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      if (data?.questions) {
        setQuestions(data.questions as SurveyData);
      } else {
        console.error('No active survey configuration found');
      }
    } catch (error) {
      console.error('Error loading survey configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveResponseToSupabase = async (response: UserResponse) => {
    try {
      const { error } = await supabase
        .from('survey_responses')
        .insert({
          questionid: response.questionId,
          answer: response.answer,
          timestamp: response.timestamp,
          session_id: sessionId
        });
      
      if (error) {
        console.error('Error saving response to Supabase:', error);
      } else {
        console.log('Response saved successfully');
      }
    } catch (err) {
      console.error('Failed to save response:', err);
    }
  };

  const formatOptionKey = (text: string): string => {
    if (!text) return '';
    
    console.log(`Formatting option key: "${text}"`);
    
    // Handle specific cases that caused issues
    if (text.trim().toLowerCase() === 'vi planerar inte alls') {
      return 'vi_planerar_inte_alls';
    }
    
    if (text.trim().toLowerCase() === 'använder i nya rätter') {
      return 'anvander_i_nya_ratter';
    }
    
    // Replace Swedish characters with their latin equivalents
    const withoutSwedishChars = text.toLowerCase()
      .replace(/å/g, 'a')
      .replace(/ä/g, 'a')
      .replace(/ö/g, 'o');
    
    // Replace spaces and non-alphanumeric characters with underscores
    const formatted = withoutSwedishChars
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') // Trim leading/trailing underscores
      .replace(/_+/g, '_'); // Replace multiple consecutive underscores with a single one
    
    console.log(`Formatted key: "${formatted}"`);
    return formatted;
  };

  const checkSkipConditions = (questionKey: string): string | null => {
    const question = questions[questionKey];
    if (!question || !question.skipToIf || !Array.isArray(question.skipToIf)) {
      return null;
    }

    console.log(`Checking skip conditions for question: ${questionKey}`);

    for (const condition of question.skipToIf as SkipCondition[]) {
      const targetResponse = responses.find(r => r.questionId === condition.question);
      
      if (targetResponse) {
        const formattedAnswer = formatOptionKey(targetResponse.answer);
        const formattedCondition = formatOptionKey(condition.equals);
        
        console.log('Checking skip condition:', {
          question: condition.question,
          responseAnswer: targetResponse.answer,
          formattedAnswer,
          equals: condition.equals,
          formattedCondition,
          to: condition.to,
          isMatch: formattedAnswer === formattedCondition
        });
        
        if (formattedAnswer === formattedCondition) {
          console.log(`Skip condition matched! Skipping to: ${condition.to}`);
          return condition.to;
        }
      }
    }
    
    console.log('No matching skip conditions found.');
    return null;
  };

  const handleAnswer = useCallback((answer: string) => {
    if (isProcessing || isAnswerAnimating) return;
    setIsProcessing(true);
    setIsAnswerAnimating(true);

    try {
      const currentTimestamp = new Date().toISOString();
      setChatHistory(prev => [...prev, { type: 'user', content: answer }]);
      
      const response: UserResponse = {
        questionId: currentQuestion,
        answer,
        timestamp: currentTimestamp,
      };

      addResponse(response);
      saveResponseToSupabase(response);

      const question = questions[currentQuestion];
      if (!question || question.end) {
        setIsProcessing(false);
        setIsAnswerAnimating(false);
        return;
      }

      const formattedAnswer = formatOptionKey(answer);
      const nextKey = `next_${formattedAnswer}`;
      
      console.log('Processing answer:', {
        currentQuestion,
        answer,
        formattedAnswer,
        nextKey,
        availableNextPaths: Object.keys(question).filter(key => key.startsWith('next'))
      });
      
      let nextQuestionKey: string | undefined;
      
      if (question[nextKey]) {
        nextQuestionKey = question[nextKey] as string;
        console.log(`Found specific next question path: ${nextKey} -> ${nextQuestionKey}`);
      } 
      else if (question.next) {
        nextQuestionKey = question.next;
        console.log(`Using default next path: ${nextQuestionKey}`);
      }

      if (nextQuestionKey) {
        console.log(`Found next question: ${nextQuestionKey}`);
        
        const processNextQuestion = (questionKey: string) => {
          const skipTo = checkSkipConditions(questionKey);
          
          if (skipTo) {
            console.log(`Skipping to ${skipTo} due to skipToIf condition`);
            return skipTo;
          }
          
          return questionKey;
        };
        
        let finalNextQuestion = nextQuestionKey;
        let skipApplied = true;
        let maxSkips = 10;
        
        while (skipApplied && maxSkips > 0) {
          const newNextQuestion = processNextQuestion(finalNextQuestion);
          skipApplied = newNextQuestion !== finalNextQuestion;
          finalNextQuestion = newNextQuestion;
          maxSkips--;
        }
        
        nextQuestionKey = finalNextQuestion;
        
        setTimeout(() => {
          setCurrentQuestion(nextQuestionKey as string);
          setIsAnswerAnimating(false);
          setIsProcessing(false);
        }, 700);
      } else {
        console.error('No next question found');
        setIsAnswerAnimating(false);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error processing answer:', error);
      setIsAnswerAnimating(false);
      setIsProcessing(false);
    }
    setUserInput('');
  }, [currentQuestion, questions, addResponse, isProcessing, isAnswerAnimating, responses]);

  const handleMultipleChoice = useCallback((selectedOptions: string[]) => {
    if (isProcessing || isAnswerAnimating) return;
    
    const answer = selectedOptions.join(", ");
    handleAnswer(answer);
  }, [handleAnswer, isProcessing, isAnswerAnimating]);

  useEffect(() => {
    if (currentQuestion && !isLoading && questions[currentQuestion]) {
      const question = questions[currentQuestion];
      setIsTyping(true);
      setTimeout(() => {
        setChatHistory(prev => [...prev, { type: 'bot', content: question.message }]);
        setIsTyping(false);
      }, 700); 
    }
  }, [currentQuestion, questions, isLoading]);

  const handleSubmit = useCallback(() => {
    if (!userInput.trim() || isProcessing) return;
    handleAnswer(userInput);
  }, [userInput, handleAnswer, isProcessing]);

  const handleOptionClick = useCallback((option: string) => {
    if (isProcessing) return;
    handleAnswer(option);
  }, [handleAnswer, isProcessing]);

  return {
    currentQuestion,
    userInput,
    setUserInput,
    chatHistory,
    isTyping,
    isLoading,
    isProcessing,
    isAnswerAnimating,
    handleSubmit,
    handleOptionClick,
    handleAnswer,
    questions,
    handleMultipleChoice,
  };
};
