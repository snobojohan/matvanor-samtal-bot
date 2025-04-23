
import React from 'react';
import { SurveyQuestion } from '@/types/survey';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

interface SurveyQuestionCardProps {
  questionId: string;
  question: SurveyQuestion;
  onUpdate: (question: SurveyQuestion) => void;
  availableQuestions: string[];
  onQuestionIdChange?: (oldId: string, newId: string) => void;
}

const SurveyQuestionCard: React.FC<SurveyQuestionCardProps> = ({
  questionId,
  question,
  onUpdate,
  availableQuestions,
  onQuestionIdChange,
}) => {
  const formatQuestionId = (value: string) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9_]+/g, '-') // Allow underscores, replace other special chars with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = formatQuestionId(e.target.value);
    if (onQuestionIdChange && newId !== questionId) {
      onQuestionIdChange(questionId, newId);
    }
  };

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

  const renderNextPath = (option: string = '', nextQuestionId: string = '') => {
    const pathKey = option ? `next_${option.toLowerCase()}` : 'next';
    const currentNext = question[pathKey] as string;

    return (
      <div className="flex items-center gap-2">
        {option && (
          <div className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium">{option}:</span>
          </div>
        )}
        <Select
          value={currentNext || ''}
          onValueChange={(value) => handleNextPathChange(option, value)}
        >
          <SelectTrigger className="w-full max-w-[200px]">
            <SelectValue placeholder="Select next question" />
          </SelectTrigger>
          <SelectContent>
            {availableQuestions.map((qId) => (
              <SelectItem key={qId} value={qId}>
                {qId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="question-id">Question ID</Label>
        <Input 
          id="question-id"
          value={questionId}
          onChange={handleIdChange}
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
            <div key={index} className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
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
              </div>
              {option && (
                <Card className="p-2 bg-gray-50">
                  {renderNextPath(option)}
                </Card>
              )}
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
        <Card className="p-4 bg-gray-50">
          <Label>Next Question</Label>
          {renderNextPath()}
        </Card>
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
