
import { useState, useEffect, useCallback } from 'react';
import { useSurvey } from '@/context/SurveyContext';
import { supabase } from '@/integrations/supabase/client';
import { UserResponse, SurveyData } from '@/types/survey';

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
  const { addResponse } = useSurvey();

  useEffect(() => {
    loadActiveConfiguration();
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

  // Memoizing the handleAnswer function to prevent recreation on each render
  const handleAnswer = useCallback((answer: string) => {
    // Prevent processing if already handling a response
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const currentTimestamp = new Date().toISOString();
      
      // Add user message to chat history
      setChatHistory(prev => [...prev, { type: 'user', content: answer }]);
      
      // Create response object
      const response: UserResponse = {
        questionId: currentQuestion,
        answer,
        timestamp: currentTimestamp,
      };

      // Add to survey context and save to database
      addResponse(response);
      saveResponseToSupabase(response);

      // Check if we're at the end
      const question = questions[currentQuestion];
      if (!question || question.end) {
        setIsProcessing(false);
        return;
      }

      // Convert answer to lowercase for matching (use full answer)
      const lowerAnswer = answer.toLowerCase();
      const nextKey = `next_${lowerAnswer}`;
      
      console.log('Processing answer:', {
        currentQuestion,
        nextKey,
        availableNextPaths: Object.keys(question).filter(key => key.startsWith('next'))
      });
      
      const nextQuestionKey = question[nextKey] || question.next;

      if (nextQuestionKey) {
        setCurrentQuestion(nextQuestionKey as string);
      } else {
        console.error('No next question found');
      }
    } finally {
      // Reset processing state
      setIsProcessing(false);
      // Clear input field
      setUserInput('');
    }
  }, [currentQuestion, questions, addResponse, isProcessing, sessionId]);

  // Process bot responses when question changes
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

  // Separate direct submit and option click handlers
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
    handleSubmit,
    handleOptionClick,
    handleAnswer,
    questions,
  };
};
