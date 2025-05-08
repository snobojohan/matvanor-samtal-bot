import { useState, useEffect, useCallback, useRef } from 'react';
import { useSurvey } from '@/context/SurveyContext';
import { UserResponse, SurveyData } from '@/types/survey';
import { formatOptionKey, determineNextQuestion, substitutePronouns } from '@/utils/surveyUtils';
import { loadSurveyQuestions, saveResponse } from '@/services/surveyService';

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
  // Track displayed questions to prevent duplicates
  const displayedQuestions = useRef<Set<string>>(new Set());

  useEffect(() => {
    const initializeQuestions = async () => {
      setIsLoading(true);
      const loadedQuestions = await loadSurveyQuestions();
      setQuestions(loadedQuestions);
      setIsLoading(false);
      // Reset displayed questions when survey is initialized
      displayedQuestions.current = new Set();
    };

    initializeQuestions();
  }, []);

  const handleAnswer = useCallback((answer: string) => {
    if (isProcessing || isAnswerAnimating) return;
    setIsProcessing(true);
    setIsAnswerAnimating(true);

    try {
      const currentTimestamp = new Date().toISOString();
      
      // When displaying the user's answer in chat history, substitute pronouns if applicable
      // This ensures we display "Jag..." instead of "Vi..." for single households
      const displayAnswer = substitutePronouns(answer, responses);
      setChatHistory(prev => [...prev, { type: 'user', content: displayAnswer }]);
      
      // Store original answer in the response data for navigation logic
      const response: UserResponse = {
        questionId: currentQuestion,
        answer,
        timestamp: currentTimestamp,
      };

      addResponse(response);
      saveResponse(response, sessionId);

      const question = questions[currentQuestion];
      if (!question || question.end) {
        setIsProcessing(false);
        setIsAnswerAnimating(false);
        return;
      }

      const nextQuestionKey = determineNextQuestion(currentQuestion, answer, questions, responses);
      
      if (nextQuestionKey) {
        // First show the user's answer and disable inputs
        setIsAnswerAnimating(true);
        setIsTyping(true);
        
        // Wait before showing the next question and its alternatives
        setTimeout(() => {
          setCurrentQuestion(nextQuestionKey);
          setIsAnswerAnimating(false);
          setIsProcessing(false);
          setIsTyping(false);
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
  }, [currentQuestion, questions, addResponse, isProcessing, isAnswerAnimating, responses, sessionId]);

  const handleMultipleChoice = useCallback((selectedOptions: string[]) => {
    if (isProcessing || isAnswerAnimating) return;
    
    const answer = selectedOptions.join(", ");
    handleAnswer(answer);
  }, [handleAnswer, isProcessing, isAnswerAnimating]);

  useEffect(() => {
    if (currentQuestion && !isLoading && questions[currentQuestion]) {
      // Only add the question to chat history if it hasn't been displayed before
      if (!displayedQuestions.current.has(currentQuestion)) {
        const question = questions[currentQuestion];
        // Apply pronoun substitution to the message
        const adaptedMessage = substitutePronouns(question.message, responses);
        setChatHistory(prev => [...prev, { type: 'bot', content: adaptedMessage }]);
        // Mark this question as displayed
        displayedQuestions.current.add(currentQuestion);
      }
    }
  }, [currentQuestion, questions, isLoading, responses]);

  const handleSubmit = useCallback(() => {
    if (!userInput.trim() || isProcessing) return;
    handleAnswer(userInput);
  }, [userInput, handleAnswer, isProcessing]);

  const handleOptionClick = useCallback((option: string) => {
    if (isProcessing) return;
    handleAnswer(option);
  }, [handleAnswer, isProcessing]);

  // Add a function to reset the survey
  const resetSurvey = useCallback(() => {
    setCurrentQuestion('welcome');
    setChatHistory([]);
    setUserInput('');
    displayedQuestions.current = new Set();
  }, []);

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
    resetSurvey,
  };
};
