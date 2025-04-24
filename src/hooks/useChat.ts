
import { useState, useEffect } from 'react';
import { useSurvey } from '@/context/SurveyContext';
import { supabase } from '@/integrations/supabase/client';
import { UserResponse, SurveyData } from '@/types/survey';

interface ChatMessage {
  type: 'bot' | 'user';
  content: string;
}

export const useChat = () => {
  const [currentQuestion, setCurrentQuestion] = useState('welcome');
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [isTyping, setIsTyping] = useState(false);
  const [questions, setQuestions] = useState<SurveyData>({});
  const [isLoading, setIsLoading] = useState(true);
  const { addResponse } = useSurvey();

  useEffect(() => {
    loadActiveConfiguration();
  }, []);

  const loadActiveConfiguration = async () => {
    try {
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
        console.log('Response saved to Supabase successfully');
      }
    } catch (err) {
      console.error('Failed to save response:', err);
    }
  };

  const handleAnswer = (answer: string) => {
    setChatHistory(prev => [...prev, { type: 'user', content: answer }]);
    
    const response: UserResponse = {
      questionId: currentQuestion,
      answer,
      timestamp: new Date().toISOString(),
    };
    addResponse(response);
    saveResponseToSupabase(response);

    const question = questions[currentQuestion];
    if (!question || question.end) {
      return;
    }

    const simplifiedAnswer = answer.toLowerCase().replace(/[.,!?]/g, '').split(' ')[0];
    
    console.log('Current question:', currentQuestion);
    console.log('Original answer:', answer);
    console.log('Simplified answer:', simplifiedAnswer);
    
    const possibleNextKeys = [
      `next_${simplifiedAnswer}`,
      `next_${answer.toLowerCase()}`,
    ];
    
    console.log('Possible next keys:', possibleNextKeys);
    console.log('Available next paths:', Object.keys(question).filter(key => key.startsWith('next')));
    
    let nextQuestionKey = null;
    for (const key of possibleNextKeys) {
      if (question[key]) {
        nextQuestionKey = question[key];
        console.log(`Found match with key: ${key} -> ${nextQuestionKey}`);
        break;
      }
    }
    
    if (!nextQuestionKey && question.next) {
      nextQuestionKey = question.next;
      console.log('Using default next:', nextQuestionKey);
    }

    if (nextQuestionKey) {
      console.log('Setting next question to:', nextQuestionKey);
      setTimeout(() => {
        setCurrentQuestion(nextQuestionKey);
      }, 100);
    } else {
      console.error('No next question found!');
    }
  };

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

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    handleAnswer(userInput);
    setUserInput('');
  };

  return {
    currentQuestion,
    userInput,
    setUserInput,
    chatHistory,
    isTyping,
    isLoading,
    handleSubmit,
    handleAnswer,
  };
};
