
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SurveyQuestionCard from '@/components/survey/SurveyQuestionCard';
import QuestionFlow from '@/components/survey/QuestionFlow';
import EditSurveyHeader from '@/components/survey/EditSurveyHeader';
import QuestionsList from '@/components/survey/QuestionsList';
import { useSurveyEditor } from '@/hooks/useSurveyEditor';

const EditSurvey = () => {
  const {
    questions,
    selectedQuestion,
    isSaving,
    setSelectedQuestion,
    handleAddQuestion,
    handleQuestionIdChange,
    handleUpdateQuestion,
    saveConfiguration,
  } = useSurveyEditor();

  return (
    <div className="container mx-auto py-8 px-4">
      <EditSurveyHeader onSave={saveConfiguration} isSaving={isSaving} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuestionsList
          questions={questions}
          selectedQuestion={selectedQuestion}
          onSelectQuestion={setSelectedQuestion}
          onAddQuestion={handleAddQuestion}
        />

        <div>
          {selectedQuestion ? (
            <Card>
              <CardContent className="pt-6">
                <SurveyQuestionCard
                  questionId={selectedQuestion}
                  question={questions[selectedQuestion]}
                  onUpdate={(updatedQuestion) => handleUpdateQuestion(selectedQuestion, updatedQuestion)}
                  availableQuestions={Object.keys(questions).filter(id => id !== selectedQuestion)}
                  onQuestionIdChange={handleQuestionIdChange}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg p-8">
              <p className="text-gray-500">Select a question to edit</p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-bold mb-4">Question Flow</h2>
          <div className="bg-white p-4 rounded-md">
            <QuestionFlow
              questions={questions}
              selectedQuestion={selectedQuestion}
              onSelectQuestion={setSelectedQuestion}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSurvey;
