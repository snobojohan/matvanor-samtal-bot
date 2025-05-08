import React, { useState, useRef, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface MultipleChoiceInputProps {
  options: string[];
  onSubmit: (selectedOptions: string[]) => void;
  disabled?: boolean;
}

const MultipleChoiceInput = ({ options, onSubmit, disabled }: MultipleChoiceInputProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize refs array for option elements
  useEffect(() => {
    optionRefs.current = Array(options.length).fill(null);
  }, [options.length]);

  const handleCheckboxChange = (checked: boolean, option: string) => {
    setSelectedOptions(prev => 
      checked 
        ? [...prev, option]
        : prev.filter(item => item !== option)
    );
  };

  const handleOptionClick = (option: string) => {
    const isSelected = selectedOptions.includes(option);
    handleCheckboxChange(!isSelected, option);
  };

  const handleSubmit = () => {
    if (selectedOptions.length > 0) {
      onSubmit(selectedOptions);
      setSelectedOptions([]); // Reset after submission
    }
  };

  // Handle keyboard navigation and submission
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (disabled) return;

    let nextIndex: number;
    let prevIndex: number;

    switch (e.key) {
      case 'Enter':
      case ' ': // Space key
        e.preventDefault();
        handleOptionClick(options[index]);
        break;
      case 'Tab':
        // Tab navigation is handled natively by the browser
        break;
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (index + 1) % options.length;
        optionRefs.current[nextIndex]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        prevIndex = (index - 1 + options.length) % options.length;
        optionRefs.current[prevIndex]?.focus();
        break;
      default:
        break;
    }
  };

  // Global keydown handler for Enter key to submit
  const handleGlobalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedOptions.length > 0 && !disabled) {
      e.preventDefault();
      handleSubmit();
      submitButtonRef.current?.focus();
    }
  };

  return (
    <div className="space-y-4" onKeyDown={handleGlobalKeyDown}>
      <div className="flex flex-wrap gap-2 items-stretch">
        {options.map((option, index) => (
          <div 
            key={option} 
            className="flex flex-col flex-1 min-w-[200px]"
            onClick={() => !disabled && handleOptionClick(option)}
            ref={el => optionRefs.current[index] = el}
            tabIndex={disabled ? -1 : 0}
            role="checkbox"
            aria-checked={selectedOptions.includes(option)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            data-option-index={index}
            aria-label={option}
          >
            <div 
              className={`
                flex-1 flex items-center px-4 py-2 rounded-md text-sm font-medium
                cursor-pointer transition-colors border w-full
                ${selectedOptions.includes(option)
                  ? 'bg-[#091B1F] text-white border-[#091B1F]'
                  : 'bg-[#091B1F] text-white border-[#091B1F] hover:bg-[#091B1F]/90'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none
              `}
            >
              <Checkbox
                id={option}
                checked={selectedOptions.includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, option)}
                disabled={disabled}
                className="mr-2 border-current"
                onClick={(e) => e.stopPropagation()} // Prevent double triggering when clicking the checkbox directly
              />
              <Label
                htmlFor={option}
                className="cursor-pointer flex-1"
                onClick={(e) => e.stopPropagation()} // Prevent double triggering when clicking the label directly
              >
                {option}
              </Label>
            </div>
          </div>
        ))}
      </div>
      
      <Button
        ref={submitButtonRef}
        onClick={handleSubmit}
        disabled={disabled || selectedOptions.length === 0}
        className="w-full bg-[#091B1F] text-white hover:bg-[#091B1F]/90 transition-colors"
      >
        <Send className="mr-2 h-4 w-4" />
        Skicka
      </Button>
    </div>
  );
};

export default MultipleChoiceInput;
