
import { welcomeQuestions } from './welcome';
import { demographicQuestions } from './demographic';
import { foodPlanningQuestions } from './foodPlanning';
import { leftoverQuestions } from './leftovers';
import { mealServiceQuestions } from './mealService';
import { dietaryQuestions } from './dietary';
import { SurveyData } from '@/types/survey';

// Combine all question sections into one complete survey
export const surveyQuestions: SurveyData = {
  ...welcomeQuestions,
  ...demographicQuestions,
  ...foodPlanningQuestions,
  ...leftoverQuestions,
  ...mealServiceQuestions,
  ...dietaryQuestions
};
