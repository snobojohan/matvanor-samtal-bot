
import React, { useRef, useEffect } from 'react';
import { surveyQuestions } from '@/data/surveyQuestions';
import TypingIndicator from './TypingIndicator';
import ChatHeader from './chat/ChatHeader';
import ChatMessage from './chat/ChatMessage';
import ChatInput from './chat/ChatInput';
import { useChat } from '@/hooks/useChat';

const ChatBot = () => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const {
    currentQuestion,
    userInput,
    setUserInput,
    chatHistory,
    isTyping,
    handleSubmit,
  } = useChat();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const currentQuestionData = surveyQuestions[currentQuestion];

  return (
    <div className="flex flex-col h-screen bg-chatbg text-chattext" style={{ backgroundColor: '#F5F6F4' }}>
      <ChatHeader />

      {/* Main Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-chatbg" style={{ backgroundColor: '#F5F6F4' }}>
        <div className="max-w-[672px] mx-auto space-y-4 pb-20">
          {chatHistory.map((message, index) => (
            <ChatMessage key={index} type={message.type} content={message.content} />
          ))}
          {isTyping && (
            <div className="mb-4">
              <TypingIndicator />
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Sticky Bottom Section */}
      <div className="sticky bottom-0 bg-chatbg/80 backdrop-blur-sm p-4" style={{ backgroundColor: 'rgba(245, 246, 244, 0.8)' }}>
        <div className="max-w-[672px] mx-auto">
          <ChatInput
            value={userInput}
            onChange={setUserInput}
            onSubmit={handleSubmit}
            options={currentQuestionData?.options}
            isEnd={currentQuestionData?.end}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
