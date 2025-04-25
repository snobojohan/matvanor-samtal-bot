
import React, { useState } from 'react';
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

  const handleCheckboxChange = (checked: boolean, option: string) => {
    setSelectedOptions(prev => 
      checked 
        ? [...prev, option]
        : prev.filter(item => item !== option)
    );
  };

  const handleSubmit = () => {
    if (selectedOptions.length > 0) {
      onSubmit(selectedOptions);
      setSelectedOptions([]); // Reset after submission
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {options.map((option) => (
          <div 
            key={option} 
            className="flex items-center"
          >
            <Checkbox
              id={option}
              checked={selectedOptions.includes(option)}
              onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, option)}
              disabled={disabled}
              className="hidden" // Hide default checkbox
            />
            <Label
              htmlFor={option}
              className={`
                px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors
                ${selectedOptions.includes(option) 
                  ? 'bg-[#091B1F] text-white' 
                  : 'bg-transparent border border-[#091B1F] text-[#091B1F] hover:bg-[#091B1F]/10'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {option}
            </Label>
          </div>
        ))}
      </div>
      
      <Button
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

