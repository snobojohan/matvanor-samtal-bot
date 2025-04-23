
import React from 'react';

interface ChatMessageProps {
  type: 'bot' | 'user';
  content: string;
}

const ChatMessage = ({ type, content }: ChatMessageProps) => (
  <div className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`rounded-lg p-3 max-w-[80%] ${
        type === 'user'
          ? 'bg-[#2D9CDB] text-white'
          : 'bg-[#EFF0EF] text-chattext shadow-sm'
      }`}
    >
      {content}
    </div>
  </div>
);

export default ChatMessage;
