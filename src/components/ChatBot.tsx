
import React, { useRef, useEffect } from 'react';
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
    isLoading,
    handleSubmit,
    questions
  } = useChat();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  // Determine if we're at the end of the survey
  const isEndQuestion = !isLoading && currentQuestion && questions?.[currentQuestion]?.end === true;
  
  // Get options for the current question if available
  const currentOptions = !isLoading && currentQuestion && questions?.[currentQuestion]?.options;

  return (
    <div className="flex flex-col h-screen bg-chatbg text-chattext" style={{ backgroundColor: '#F5F6F4' }}>
      <ChatHeader />

      {/* Main Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-chatbg" style={{ backgroundColor: '#F5F6F4' }}>
        <div className="max-w-[672px] mx-auto space-y-4 pb-20">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <TypingIndicator />
                <p className="mt-2 text-sm text-gray-500">Laddar undersökningen...</p>
              </div>
            </div>
          ) : (
            <>
              {chatHistory.map((message, index) => (
                <ChatMessage key={index} type={message.type} content={message.content} />
              ))}
              {isTyping && (
                <div className="mb-4">
                  <TypingIndicator />
                </div>
              )}
            </>
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
            options={currentOptions}
            isEnd={isEndQuestion}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
