
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface QuestionMessageProps {
  message: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const QuestionMessage = ({ message, onChange }: QuestionMessageProps) => {
  return (
    <div>
      <Label>Message</Label>
      <Textarea
        value={message}
        onChange={onChange}
        className="min-h-[100px]"
      />
    </div>
  );
};

export default QuestionMessage;
