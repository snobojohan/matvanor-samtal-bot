import { SurveyData } from '@/types/survey';
import { surveyQuestions as originalQuestions } from '@/data/allSurveyQuestions';
import { surveyQuestions as newQuestions } from '@/data/allSurveyQuestionsV2';
import { getUrlParameter } from './urlParams';

/**
 * Gets the appropriate survey questions based on URL parameters
 * 
 * Usage: 
 * - Version 1 (legacy): ?version=1
 * - Default version (v2): no parameter needed
 * 
 * @returns The selected survey questions object
 */
export const getSurveyQuestions = (): SurveyData => {
  
  const version = getUrlParameter('version', '2');
  
  switch (version) {
    case '1':
      console.log('Using survey questions version 1 (legacy)');
      return originalQuestions;
    case '2':
    default:
      console.log('Using survey questions version 2 (default)');
      return newQuestions;
  }
}; 