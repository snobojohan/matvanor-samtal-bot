
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { surveyQuestions } from '@/data/surveyQuestions';
import { useSurvey } from '@/context/SurveyContext';
import { UserResponse } from '@/types/survey';
import { supabase } from '@/integrations/supabase/client';
import TypingIndicator from './TypingIndicator';

const ChatBot = () => {
  const [currentQuestion, setCurrentQuestion] = useState('welcome');
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ type: 'bot' | 'user', content: string }>>([]);
  const [sessionId] = useState(() => crypto.randomUUID());
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { addResponse, responses } = useSurvey();
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentQuestion) {
      const question = surveyQuestions[currentQuestion];
      if (question) {
        setIsTyping(true);
        setTimeout(() => {
          setChatHistory(prev => [...prev, { type: 'bot', content: question.message }]);
          setIsTyping(false);
        }, 700);
      }
    }
  }, [currentQuestion]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

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

    const question = surveyQuestions[currentQuestion];
    if (question.end) {
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

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    handleAnswer(userInput);
    setUserInput('');
  };

  const currentQuestionData = surveyQuestions[currentQuestion];

  return (
    <div className="flex flex-col h-screen bg-chatbg text-chattext">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-chatbg/80 backdrop-blur-sm p-4">
        <h1 className="text-xl font-semibold">Undersökning om matvanor</h1>
      </div>

      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {chatHistory.map((message, index) => {
            const opacity = Math.max(0.4, 1 - (chatHistory.length - 1 - index) * 0.15);
            return (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ opacity }}
              >
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.type === 'user'
                      ? 'bg-chatblue text-white'
                      : 'bg-white text-chattext shadow-sm'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            );
          })}
          {isTyping && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Sticky Bottom Section */}
      <div className="sticky bottom-0 bg-chatbg/80 backdrop-blur-sm p-4">
        <div className="max-w-2xl mx-auto">
          {currentQuestionData?.options ? (
            <div className="grid grid-cols-1 gap-2">
              {currentQuestionData.options.map((option) => (
                <Button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className="w-full bg-chatblue text-white hover:bg-chatblue/90 transition-colors"
                  size="lg"
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
                  className="flex-1 bg-white text-chattext"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <Button 
                  onClick={handleSubmit}
                  className="bg-chatblue hover:bg-chatblue/90"
                >
                  <Send className="text-white" />
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
