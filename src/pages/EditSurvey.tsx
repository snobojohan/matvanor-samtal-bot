import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { surveyQuestions } from '@/data/surveyQuestions';
import SurveyQuestionCard from '@/components/survey/SurveyQuestionCard';
import { SurveyQuestion, SurveyData } from '@/types/survey';
import QuestionFlow from '@/components/survey/QuestionFlow';
import { supabase } from '@/integrations/supabase/client';
import AddQuestionButton from '@/components/survey/AddQuestionButton';

const EditSurvey = () => {
  const [questions, setQuestions] = useState<SurveyData>(surveyQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadActiveConfiguration();
  }, []);

  const loadActiveConfiguration = async () => {
    try {
      const { data, error } = await supabase
        .from('survey_configurations')
        .select('questions')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      if (data?.questions) {
        setQuestions(data.questions as SurveyData);
      }
    } catch (error) {
      console.error('Error loading survey configuration:', error);
      toast({
        title: "Error Loading Survey",
        description: "Failed to load the survey configuration.",
        variant: "destructive",
      });
    }
  };

  const saveConfiguration = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('survey_configurations')
        .update({ 
          questions,
          updated_at: new Date().toISOString()
        })
        .eq('is_active', true);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Survey configuration saved successfully.",
      });
    } catch (error) {
      console.error('Error saving survey configuration:', error);
      toast({
        title: "Error Saving Survey",
        description: "Failed to save the survey configuration.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddQuestion = () => {
    const newQuestionId = `question_${Object.keys(questions).length + 1}`;
    setQuestions((prev) => ({
      ...prev,
      [newQuestionId]: {
        message: '',
        options: [''],
      },
    }));
    setSelectedQuestion(newQuestionId);
  };

  const handleQuestionIdChange = (oldId: string, newId: string) => {
    if (oldId === newId || questions[newId]) return; // Prevent duplicate IDs

    const updatedQuestions = { ...questions };
    
    // Update the question ID
    updatedQuestions[newId] = updatedQuestions[oldId];
    delete updatedQuestions[oldId];

    // Update any references to this question ID in other questions
    Object.keys(updatedQuestions).forEach((qId) => {
      const q = updatedQuestions[qId];
      
      // Update simple next path
      if (q.next === oldId) {
        updatedQuestions[qId] = { ...q, next: newId };
      }

      // Update option-specific next paths
      if (q.options) {
        q.options.forEach((option) => {
          const nextKey = `next_${option.toLowerCase()}`;
          if (q[nextKey] === oldId) {
            updatedQuestions[qId] = { 
              ...updatedQuestions[qId],
              [nextKey]: newId 
            };
          }
        });
      }
    });

    setQuestions(updatedQuestions);
    setSelectedQuestion(newId);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link to="/" className="mr-4 flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Survey
          </Link>
          <h1 className="text-3xl font-bold">Edit Survey Questions</h1>
        </div>
        <Button 
          onClick={saveConfiguration} 
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          
          <h2 className="font-bold mb-4">Questions</h2>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
            {Object.entries(questions).map(([questionId, question]) => (
              <div
                key={questionId}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedQuestion === questionId
                    ? 'bg-[#2D9CDB] text-white'
                    : 'bg-white hover:bg-gray-100'
                }`}
                onClick={() => setSelectedQuestion(questionId)}
              >
                <div className="font-medium">{questionId}</div>
                <div className="text-sm truncate">
                  {question.message.substring(0, 60)}
                  {question.message.length > 60 ? '...' : ''}
                </div>
                <div className="flex mt-1 text-xs">
                  {question.options ? (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
                      Options
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      {question.type || 'Text'}
                    </span>
                  )}
                  {question.end && (
                    <span className="ml-2 px-2 py-1 rounded-full bg-red-100 text-red-800">
                      End
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <AddQuestionButton onAdd={handleAddQuestion} />
        </div>

        <div>
          {selectedQuestion ? (
            <Card>
              <CardContent className="pt-6">
                <SurveyQuestionCard
                  questionId={selectedQuestion}
                  question={questions[selectedQuestion]}
                  onUpdate={(updatedQuestion) => {
                    setQuestions((prev) => ({
                      ...prev,
                      [selectedQuestion]: updatedQuestion,
                    }));
                  }}
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
