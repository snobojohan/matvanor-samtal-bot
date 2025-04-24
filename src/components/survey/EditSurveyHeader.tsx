
import React, { useEffect } from 'react';
import { Link, useBeforeUnload, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditSurveyHeaderProps {
  onSave: () => void;
  isSaving: boolean;
  hasUnsavedChanges?: boolean;
}

const EditSurveyHeader = ({ onSave, isSaving, hasUnsavedChanges = false }: EditSurveyHeaderProps) => {
  const navigate = useNavigate();

  useBeforeUnload(
    React.useCallback(
      (event) => {
        if (hasUnsavedChanges) {
          event.preventDefault();
          return (event.returnValue = 'You have unsaved changes. Are you sure you want to leave?');
        }
      },
      [hasUnsavedChanges]
    )
  );

  // Handle navigation attempts within the app
  useEffect(() => {
    const handleBeforeNavigate = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        if (!window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
          event.preventDefault();
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeNavigate);
    return () => window.removeEventListener('beforeunload', handleBeforeNavigate);
  }, [hasUnsavedChanges]);

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
          disabled={isSaving}
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
