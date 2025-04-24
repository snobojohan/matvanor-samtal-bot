
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditSurveyHeaderProps {
  onSave: () => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

const EditSurveyHeader = ({ 
  onSave, 
  isSaving, 
  hasUnsavedChanges 
}: EditSurveyHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-background border-b">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link to="/" className="mr-4 flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Survey
          </Link>
          <h1 className="text-3xl font-bold">Edit Survey Questions</h1>
        </div>
        <Button 
          onClick={onSave} 
          disabled={isSaving || !hasUnsavedChanges}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default EditSurveyHeader;
