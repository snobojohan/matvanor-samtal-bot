import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { surveyQuestions } from '@/data/surveyQuestions';
import { SurveyData, SurveyQuestion } from '@/types/survey';

export const useSurveyEditor = () => {
  const [questions, setQuestions] = useState<SurveyData>(surveyQuestions);
  const [originalQuestions, setOriginalQuestions] = useState<SurveyData>(surveyQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadActiveConfiguration();
  }, []);

  useEffect(() => {
    const hasChanges = JSON.stringify(questions) !== JSON.stringify(originalQuestions);
    setHasUnsavedChanges(hasChanges);
  }, [questions, originalQuestions]);

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
        setOriginalQuestions(data.questions as SurveyData);
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
    if (oldId === newId || questions[newId]) return;
    if (!newId || newId.trim() === '') return;

    const updatedQuestions = { ...questions };
    updatedQuestions[newId] = updatedQuestions[oldId];
    delete updatedQuestions[oldId];

    Object.keys(updatedQuestions).forEach((qId) => {
      const q = updatedQuestions[qId];
      if (q.next === oldId) {
        updatedQuestions[qId] = { ...q, next: newId };
      }
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

  const handleUpdateQuestion = (questionId: string, updatedQuestion: SurveyQuestion) => {
    setQuestions((prev) => ({
      ...prev,
      [questionId]: updatedQuestion,
    }));
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

      setOriginalQuestions(questions);
      setHasUnsavedChanges(false);
      
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

  return {
    questions,
    selectedQuestion,
    isSaving,
    hasUnsavedChanges,
    setSelectedQuestion,
    handleAddQuestion,
    handleQuestionIdChange,
    handleUpdateQuestion,
    saveConfiguration,
  };
};
