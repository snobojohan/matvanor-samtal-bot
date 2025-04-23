
import React from 'react';
import { SurveyQuestion } from '@/types/survey';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SurveyQuestionCardProps {
  questionId: string;
  question: SurveyQuestion;
  onUpdate: (question: SurveyQuestion) => void;
}

const SurveyQuestionCard: React.FC<SurveyQuestionCardProps> = ({
  questionId,
  question,
  onUpdate,
}) => {
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...question, message: e.target.value });
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!question.options) return;
    const newOptions = [...question.options];
    newOptions[index] = value;
    onUpdate({ ...question, options: newOptions });
  };

  const handleAddOption = () => {
    const newOptions = [...(question.options || []), ''];
    onUpdate({ ...question, options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = question.options?.filter((_, i) => i !== index);
    onUpdate({ ...question, options: newOptions });
  };

  const toggleEndQuestion = () => {
    onUpdate({ ...question, end: !question.end });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Question ID</Label>
        <Input value={questionId} disabled />
      </div>

      <div>
        <Label>Message</Label>
        <Textarea
          value={question.message}
          onChange={handleMessageChange}
          className="min-h-[100px]"
        />
      </div>

      <div>
        <Label>Options</Label>
        {question.options?.map((option, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <Input
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
            />
            <button
              onClick={() => handleRemoveOption(index)}
              className="p-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={handleAddOption}
          className="mt-2 text-sm text-blue-500 hover:text-blue-700"
        >
          + Add Option
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="end-question"
          checked={question.end || false}
          onCheckedChange={toggleEndQuestion}
        />
        <Label htmlFor="end-question">End Question</Label>
      </div>
    </div>
  );
};

export default SurveyQuestionCard;
