
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddQuestionButtonProps {
  onAdd: () => void;
}

const AddQuestionButton: React.FC<AddQuestionButtonProps> = ({ onAdd }) => {
  return (
    <Button 
      onClick={onAdd} 
      variant="outline" 
      className="w-full flex items-center justify-center gap-2 mb-4"
    >
      <Plus className="h-4 w-4" />
      Add New Question
    </Button>
  );
};

export default AddQuestionButton;
