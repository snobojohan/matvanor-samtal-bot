import React, { useCallback, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import MultipleChoiceInput from './MultipleChoiceInput';
import { useSurvey } from '@/context/SurveyContext';
import { substitutePronouns } from '@/utils/surveyUtils';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onOptionClick: (option: string) => void;
  options?: string[];
  isEnd?: boolean;
  disabled?: boolean;
  type?: string;
  onMultipleChoice?: (selected: string[]) => void;
  currentQuestion?: string;
}

const ChatInput = ({ 
  value, 
  onChange, 
  onSubmit, 
  onOptionClick,
  options, 
  isEnd, 
  disabled,
  type,
  onMultipleChoice,
  currentQuestion
}: ChatInputProps) => {
  const { responses } = useSurvey();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const processOptionText = useCallback((option: string) => {
    return substitutePronouns(option, responses);
  }, [responses]);

  // Focus the textarea when the component mounts or when options change to empty
  useEffect(() => {
    // Only focus if this is a text input question (no options) and not disabled
    if (!options?.length && !disabled && !isEnd && textareaRef.current) {
      // Small timeout to ensure DOM is ready and any animations are complete
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [options, disabled, isEnd, currentQuestion]);

  if (isEnd) return null;

  if (type === "multiple_choice" && options && onMultipleChoice) {
    // For multiple choice, we need to map back from displayed options to original options
    const processedOptions = options.map(processOptionText);
    
    const handleMultipleChoice = (selectedDisplayOptions: string[]) => {
      // Map selected displayed options back to original options
      const selectedOriginalOptions = selectedDisplayOptions.map(displayOption => {
        const index = processedOptions.indexOf(displayOption);
        return index !== -1 ? options[index] : displayOption;
      });
      onMultipleChoice(selectedOriginalOptions);
    };
    
    return (
      <MultipleChoiceInput
        options={processedOptions}
        onSubmit={handleMultipleChoice}
        disabled={disabled}
      />
    );
  }

  if (options && options.length > 0) {
    return (
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          const displayText = processOptionText(option);
          return (
            <Button
              key={option}
              onClick={() => onOptionClick(option)} // Use original option for data
              className="flex-1 bg-[#091B1F] text-white hover:bg-[#091B1F]/90 transition-colors"
              size="lg"
              disabled={disabled}
            >
              {displayText} {/* Display substituted text */}
            </Button>
          );
        })}
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
        className="pr-12 bg-white text-chattext rounded-2xl shadow-lg min-h-[56px] py-4 text-base"
        onKeyPress={handleKeyPress}
        disabled={disabled}
        ref={textareaRef}
      />
      <Button 
        onClick={onSubmit}
        className="absolute right-3 bottom-3 p-0 h-8 w-8 bg-[#091B1F] hover:bg-[#091B1F]/90 rounded-full"
        disabled={disabled || !value.trim()}
      >
        <div className="send-special">
          <Send className="h-4 w-4 text-white" />
        </div>
      </Button>
    </div>
  );
};

export default ChatInput;
