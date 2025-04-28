
import { supabase } from '@/integrations/supabase/client';
import { SurveyData, UserResponse } from '@/types/survey';
import { LOCAL_QUESTIONS } from '@/constants/config';
import { surveyQuestions } from '@/data/survey';

/**
 * Loads the active survey configuration from Supabase
 */
export const loadSurveyQuestions = async (): Promise<SurveyData> => {
  if (LOCAL_QUESTIONS) {
    return surveyQuestions;
  }

  try {
    const { data, error } = await supabase
      .from('survey_configurations')
      .select('questions')
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    
    if (data?.questions) {
      return data.questions as SurveyData;
    } else {
      console.error('No active survey configuration found');
      return {};
    }
  } catch (error) {
    console.error('Error loading survey configuration:', error);
    return {};
  }
};

/**
 * Saves a user response to Supabase
 */
export const saveResponse = async (response: UserResponse, sessionId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('survey_responses')
      .insert({
        questionid: response.questionId,
        answer: response.answer,
        timestamp: response.timestamp,
        session_id: sessionId
      });
    
    if (error) {
      console.error('Error saving response to Supabase:', error);
    } else {
      console.log('Response saved successfully');
    }
  } catch (err) {
    console.error('Failed to save response:', err);
  }
};
