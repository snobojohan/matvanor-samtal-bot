
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuestionOptionsProps {
  options: string[];
  onOptionChange: (index: number, value: string) => void;
  onOptionRemove: (index: number) => void;
  onOptionAdd: () => void;
  availableQuestions: string[];
  onNextPathChange: (option: string, nextQuestionId: string) => void;
  getNextPath: (option: string) => string;
}

const QuestionOptions = ({
  options,
  onOptionChange,
  onOptionRemove,
  onOptionAdd,
  availableQuestions,
  onNextPathChange,
  getNextPath,
}: QuestionOptionsProps) => {
  return (
    <div>
      <Label className="mb-2 block">Options</Label>
      {options.map((option, index) => (
        <div key={index} className="space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <Input
              value={option}
              onChange={(e) => onOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOptionRemove(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {option && (
            <Card className="p-2 bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{option}:</span>
                </div>
                <Select
                  value={getNextPath(option) || ''}
                  onValueChange={(value) => onNextPathChange(option, value)}
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
            </Card>
          )}
        </div>
      ))}
      <Button
        onClick={onOptionAdd}
        variant="outline"
        className="mt-2"
        type="button"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Option
      </Button>
    </div>
  );
};

export default QuestionOptions;
