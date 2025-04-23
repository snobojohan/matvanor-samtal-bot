
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { surveyQuestions } from '@/data/surveyQuestions';
import { useSurvey } from '@/context/SurveyContext';
import { UserResponse } from '@/types/survey';

const ChatBot = () => {
  const [currentQuestion, setCurrentQuestion] = useState('welcome');
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ type: 'bot' | 'user', content: string }>>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { addResponse } = useSurvey();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentQuestion) {
      const question = surveyQuestions[currentQuestion];
      if (question) {
        setChatHistory(prev => [...prev, { type: 'bot', content: question.message }]);
      }
    }
  }, [currentQuestion]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleAnswer = (answer: string) => {
    setChatHistory(prev => [...prev, { type: 'user', content: answer }]);
    
    const response: UserResponse = {
      questionId: currentQuestion,
      answer,
      timestamp: new Date().toISOString(),
    };
    addResponse(response);

    const question = surveyQuestions[currentQuestion];
    if (question.end) {
      return;
    }

    // Create the key format for option-specific next question
    const nextOptionKey = `next_${answer.toLowerCase()}`;
    
    // Check if there's a specific next question for this answer
    const nextQuestionKey = question.options && question[nextOptionKey] 
      ? question[nextOptionKey]
      : question.next;

    if (nextQuestionKey) {
      setCurrentQuestion(nextQuestionKey);
    }
  };

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    handleAnswer(userInput);
    setUserInput('');
  };

  const currentQuestionData = surveyQuestions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen flex flex-col">
      <Card className="flex-1 p-4 mb-4 overflow-y-auto max-h-[70vh]">
        <div className="space-y-4">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.type === 'bot' && (
                  <MessageSquare className="inline-block mr-2 h-4 w-4" />
                )}
                {message.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </Card>

      <div className="space-y-4">
        {currentQuestionData?.options ? (
          <div className="flex flex-wrap gap-2">
            {currentQuestionData.options.map((option) => (
              <Button
                key={option}
                onClick={() => handleAnswer(option)}
                variant="outline"
                className="flex-1"
              >
                {option}
              </Button>
            ))}
          </div>
        ) : (
          !currentQuestionData?.end && (
            <div className="flex gap-2">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Skriv ditt svar här..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <Button onClick={handleSubmit}>Skicka</Button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ChatBot;
