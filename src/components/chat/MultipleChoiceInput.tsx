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
      <div className="flex flex-wrap gap-2 items-stretch">
        {options.map((option) => (
          <div 
            key={option} 
            className="flex flex-col flex-1 min-w-[200px]"
          >
            <div 
              className={`
                flex-1 flex items-center px-4 py-2 rounded-md text-sm font-medium
                cursor-pointer transition-colors border w-full
                ${selectedOptions.includes(option)
                  ? 'bg-[#091B1F] text-white border-[#091B1F]'
                  : 'bg-[#091B1F] text-white border-[#091B1F] hover:bg-[#091B1F]/90'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <Checkbox
                id={option}
                checked={selectedOptions.includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, option)}
                disabled={disabled}
                className="mr-2 border-current"
              />
              <Label
                htmlFor={option}
                className="cursor-pointer"
              >
                {option}
              </Label>
            </div>
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
