
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface QuestionSettingsProps {
  questionId: string;
  hasOptions: boolean;
  onIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: (value: "text" | "options") => void;
}

const QuestionSettings = ({ questionId, hasOptions, onIdChange, onTypeChange }: QuestionSettingsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="question-id">Question ID</Label>
        <Input 
          id="question-id"
          value={questionId}
          onChange={onIdChange}
          placeholder="question-id"
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground mt-1">
          IDs are automatically formatted to be URL-friendly
        </p>
      </div>

      <div>
        <Label>Question Type</Label>
        <RadioGroup
          value={hasOptions ? "options" : "text"}
          onValueChange={(value) => onTypeChange(value as "text" | "options")}
          className="flex gap-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="options" id="options" />
            <Label htmlFor="options">Multiple Choice</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="text" />
            <Label htmlFor="text">Text Input</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default QuestionSettings;
