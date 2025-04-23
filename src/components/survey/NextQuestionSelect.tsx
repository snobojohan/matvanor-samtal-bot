
import React from 'react';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NextQuestionSelectProps {
  nextQuestionId: string;
  availableQuestions: string[];
  onNextQuestionChange: (nextQuestionId: string) => void;
}

const NextQuestionSelect = ({
  nextQuestionId,
  availableQuestions,
  onNextQuestionChange,
}: NextQuestionSelectProps) => {
  return (
    <Card className="p-4 bg-gray-50">
      <Label>Next Question</Label>
      <Select
        value={nextQuestionId || ''}
        onValueChange={onNextQuestionChange}
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
    </Card>
  );
};

export default NextQuestionSelect;
