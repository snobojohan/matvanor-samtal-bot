
import React from 'react';
import { SurveyQuestion } from '@/types/survey';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface SurveyQuestionCardProps {
  questionId: string;
  question: SurveyQuestion;
  onUpdate: (question: SurveyQuestion) => void;
  availableQuestions: string[];
}

const SurveyQuestionCard: React.FC<SurveyQuestionCardProps> = ({
  questionId,
  question,
  onUpdate,
  availableQuestions,
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
    // Remove corresponding next paths when removing an option
    const updatedQuestion = { ...question, options: newOptions };
    const optionKey = `next_${question.options?.[index]?.toLowerCase()}`;
    delete updatedQuestion[optionKey];
    onUpdate(updatedQuestion);
  };

  const handleNextPathChange = (option: string, nextQuestionId: string) => {
    const nextKey = option ? `next_${option.toLowerCase()}` : 'next';
    onUpdate({ ...question, [nextKey]: nextQuestionId });
  };

  const toggleEndQuestion = () => {
    onUpdate({ ...question, end: !question.end });
  };

  const handleTypeChange = (type: "text" | "options") => {
    if (type === "text") {
      onUpdate({ ...question, type: "text", options: undefined });
    } else {
      onUpdate({ ...question, type: undefined, options: [''] });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Question ID</Label>
        <Input value={questionId} disabled />
      </div>

      <div>
        <Label>Question Type</Label>
        <RadioGroup
          value={question.options ? "options" : "text"}
          onValueChange={(value) => handleTypeChange(value as "text" | "options")}
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

      <div>
        <Label>Message</Label>
        <Textarea
          value={question.message}
          onChange={handleMessageChange}
          className="min-h-[100px]"
        />
      </div>

      {question.options ? (
        <div>
          <Label className="mb-2 block">Options</Label>
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <Input
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveOption(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <select
                  className="w-full p-2 border rounded"
                  value={question[`next_${option.toLowerCase()}`] || ''}
                  onChange={(e) => handleNextPathChange(option, e.target.value)}
                >
                  <option value="">Select next question</option>
                  {availableQuestions.map((qId) => (
                    <option key={qId} value={qId}>
                      {qId}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          <Button
            onClick={handleAddOption}
            variant="outline"
            className="mt-2"
            type="button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>
      ) : (
        <div>
          <Label>Next Question</Label>
          <select
            className="w-full p-2 border rounded mt-1"
            value={question.next || ''}
            onChange={(e) => handleNextPathChange('', e.target.value)}
          >
            <option value="">Select next question</option>
            {availableQuestions.map((qId) => (
              <option key={qId} value={qId}>
                {qId}
              </option>
            ))}
          </select>
        </div>
      )}

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
