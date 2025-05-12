
import React, { useRef, useEffect, useState } from 'react';
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
    isProcessing,
    isAnswerAnimating,
    handleSubmit,
    handleOptionClick,
    handleMultipleChoice,
    questions
  } = useChat();

  const [hasInteracted, setHasInteracted] = useState(false);

  // Add logging to check component rendering
  useEffect(() => {
    console.log('ChatBot component rendered', { currentQuestion, isLoading });
    
    // Move scrollToBottom function inside the effect
    const scrollToBottom = () => {
      if (chatHistory.length > 0 || isTyping) {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    if (chatHistory.length > 0 || isTyping) {
      scrollToBottom();
    }
  }, [chatHistory, isTyping, currentQuestion, isLoading]);

  const isEndQuestion = !isLoading && currentQuestion && questions?.[currentQuestion]?.end === true;
  
  const currentOptions = !isLoading && currentQuestion && questions?.[currentQuestion]?.options;

  const isButtonsDisabled = isLoading || isProcessing || isAnswerAnimating;

  const isFirstQuestion = currentQuestion === 'welcome' && !hasInteracted;

  const handleUserInteraction = (callback, ...args) => {
    setHasInteracted(true);
    callback(...args);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[672px] min-h-[600px] max-h-[1000px] h-screen flex flex-col justify-center">
        <ChatHeader />
        <div className={`${isFirstQuestion ? 'flex-initial' : 'flex-1'} p-4 transition-all duration-500 ease-out `}>
          <div className="space-y-4 pb-5">
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

        <div className="sticky bottom-0 bg-chatbg/80 backdrop-blur-sm p-4">
          <ChatInput
            value={userInput}
            onChange={setUserInput}
            onSubmit={() => handleUserInteraction(handleSubmit)}
            onOptionClick={(option) => handleUserInteraction(handleOptionClick, option)}
            options={currentOptions}
            isEnd={isEndQuestion}
            disabled={isButtonsDisabled}
            type={currentQuestion ? questions?.[currentQuestion]?.type : undefined}
            onMultipleChoice={handleMultipleChoice}
            currentQuestion={currentQuestion}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
