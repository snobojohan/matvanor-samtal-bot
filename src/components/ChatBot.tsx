
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

    // Clean up the answer to make it simpler for key matching
    // Strip punctuation, make lowercase, and take just first word for multi-word options
    const simplifiedAnswer = answer.toLowerCase().replace(/[.,!?]/g, '').split(' ')[0];
    
    // Debug to see what's happening
    console.log('Current question:', currentQuestion);
    console.log('Original answer:', answer);
    console.log('Simplified answer:', simplifiedAnswer);
    
    // Try different key formats that might exist in the data
    const possibleNextKeys = [
      `next_${simplifiedAnswer}`,  // next_ja
      `next_${answer.toLowerCase()}`, // For full answers like "next_ja, jag vill delta"
    ];
    
    console.log('Possible next keys:', possibleNextKeys);
    console.log('Available next paths:', Object.keys(question).filter(key => key.startsWith('next')));
    
    // Find the first matching next key
    let nextQuestionKey = null;
    for (const key of possibleNextKeys) {
      if (question[key]) {
        nextQuestionKey = question[key];
        console.log(`Found match with key: ${key} -> ${nextQuestionKey}`);
        break;
      }
    }
    
    // If no specific path found, use the default next
    if (!nextQuestionKey && question.next) {
      nextQuestionKey = question.next;
      console.log('Using default next:', nextQuestionKey);
    }

    if (nextQuestionKey) {
      console.log('Setting next question to:', nextQuestionKey);
      setTimeout(() => {
        setCurrentQuestion(nextQuestionKey);
      }, 100); // Small delay to ensure UI updates properly
    } else {
      console.error('No next question found!');
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
