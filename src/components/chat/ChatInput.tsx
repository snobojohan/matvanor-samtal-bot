
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onOptionClick: (option: string) => void; // New prop for direct option handling
  options?: string[];
  isEnd?: boolean;
  disabled?: boolean;
}

const ChatInput = ({ 
  value, 
  onChange, 
  onSubmit, 
  onOptionClick, // New prop for direct option handling
  options, 
  isEnd, 
  disabled 
}: ChatInputProps) => {
  if (isEnd) return null;

  if (options && options.length > 0) {
    return (
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option}
            onClick={() => onOptionClick(option)} // Direct handler without state updates
            className="flex-1 bg-[#091B1F] text-white hover:bg-[#091B1F]/90 transition-colors"
            size="lg"
            disabled={disabled}
          >
            {option}
          </Button>
        ))}
      </div>
    );
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Skriv ditt svar här..."
        className="pr-12 bg-white text-chattext rounded-2xl shadow-lg min-h-[56px] py-4"
        onKeyPress={handleKeyPress}
        disabled={disabled}
      />
      <Button 
        onClick={onSubmit}
        className="absolute right-3 bottom-3 p-0 h-8 w-8 bg-[#091B1F] hover:bg-[#091B1F]/90 rounded-full"
        disabled={disabled || !value.trim()}
      >
        <Send className="h-4 w-4 text-white send-special" />
      </Button>
    </div>
  );
};

export default ChatInput;
