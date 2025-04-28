
import { useState, useEffect, useCallback } from 'react';
import { useSurvey } from '@/context/SurveyContext';
import { supabase } from '@/integrations/supabase/client';
import { UserResponse, SurveyData, SkipCondition } from '@/types/survey';
import { LOCAL_QUESTIONS } from '@/constants/config';
import { surveyQuestions } from '@/data/surveyQuestions';

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
    const trimmed = text.trim().toLowerCase();
    
    if (trimmed === 'använder i nya rätter') {
      return 'anvanderinyaratter';
    }
    
    return trimmed
      .replace(/[^a-z0-9]/g, '')
      .trim();
  };

  // Check if any skipToIf conditions apply for the given question
  const checkSkipConditions = (questionKey: string): string | null => {
    const question = questions[questionKey];
    if (!question || !question.skipToIf || !Array.isArray(question.skipToIf)) {
      return null;
    }

    // Loop through each skip condition
    for (const condition of question.skipToIf as SkipCondition[]) {
      // Find the response for the referenced question
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
          to: condition.to
        });
        
        if (formattedAnswer === formattedCondition) {
          return condition.to;
        }
      }
    }
    
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
      } 
      else if (question.next) {
        nextQuestionKey = question.next;
      }

      if (nextQuestionKey) {
        console.log(`Found next question: ${nextQuestionKey}`);
        
        // Apply the skipToIf logic here
        const processNextQuestion = (questionKey: string) => {
          // Check if we need to skip this question
          const skipTo = checkSkipConditions(questionKey);
          
          if (skipTo) {
            console.log(`Skipping to ${skipTo} due to skipToIf condition`);
            return skipTo;
          }
          
          return questionKey;
        };
        
        // Process the initial next question and any subsequent skips
        let finalNextQuestion = nextQuestionKey;
        let skipApplied = true;
        let maxSkips = 10; // Safety to prevent infinite loops
        
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
