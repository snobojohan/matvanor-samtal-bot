
import { SkipCondition, UserResponse } from '@/types/survey';

/**
 * Formats option strings into consistent key format for navigation 
 */
export const formatOptionKey = (text: string): string => {
  if (!text) return '';
  
  console.log(`Formatting option key: "${text}"`);
  
  // First trim the text to avoid trailing spaces
  const trimmedText = text.trim().toLowerCase();
  
  // Special case handling for known problematic strings
  if (trimmedText === 'ja, jag vill delta') {
    return 'ja_jag_vill_delta';
  }
  
  if (trimmedText === 'nej tack') {
    return 'nej_tack';
  }
  
  if (trimmedText === 'vi planerar inte alls') {
    return 'vi_planerar_inte_alls';
  }
  
  if (trimmedText === 'använder i nya rätter') {
    return 'anvander_i_nya_ratter';
  }
  
  // Replace Swedish characters with their latin equivalents
  const withoutSwedishChars = trimmedText
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o');
  
  // Replace spaces and non-alphanumeric characters with underscores
  const formatted = withoutSwedishChars
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') // Trim leading/trailing underscores
    .replace(/_+/g, '_'); // Replace multiple consecutive underscores with a single one
  
  console.log(`Formatted key: "${formatted}"`);
  return formatted;
};

/**
 * Checks skip conditions for the current question
 */
export const checkSkipConditions = (
  questionKey: string,
  questions: any,
  responses: UserResponse[]
): string | null => {
  const question = questions[questionKey];
  if (!question || !question.skipToIf || !Array.isArray(question.skipToIf)) {
    return null;
  }

  console.log(`Checking skip conditions for question: ${questionKey}`);

  for (const condition of question.skipToIf as SkipCondition[]) {
    const targetResponse = responses.find(r => r.questionId === condition.question);
    
    if (targetResponse) {
      const formattedAnswer = formatOptionKey(targetResponse.answer);
      const formattedCondition = formatOptionKey(condition.equals);
      
      console.log('Checking skip condition:', {
        question: condition.question,
        responseAnswer: targetResponse.answer,
        formattedAnswer,
        equals: condition.equals,
        formattedCondition,
        to: condition.to,
        isMatch: formattedAnswer === formattedCondition
      });
      
      if (formattedAnswer === formattedCondition) {
        console.log(`Skip condition matched! Skipping to: ${condition.to}`);
        return condition.to;
      }
    }
  }
  
  console.log('No matching skip conditions found.');
  return null;
};

/**
 * Determines the next question based on answer and conditions
 */
export const determineNextQuestion = (
  currentQuestion: string,
  answer: string,
  questions: any,
  responses: UserResponse[]
): string | undefined => {
  const question = questions[currentQuestion];
  if (!question) {
    console.error('No question found for:', currentQuestion);
    return undefined;
  }

  const formattedAnswer = formatOptionKey(answer);
  const nextKey = `next_${formattedAnswer}`;
  
  console.log('Processing answer:', {
    currentQuestion,
    answer,
    formattedAnswer,
    nextKey,
    availableNextPaths: Object.keys(question).filter(key => key.startsWith('next'))
  });
  
  let nextQuestionKey: string | undefined;
  
  if (question[nextKey]) {
    nextQuestionKey = question[nextKey] as string;
    console.log(`Found specific next question path: ${nextKey} -> ${nextQuestionKey}`);
  } 
  else if (question.next) {
    nextQuestionKey = question.next;
    console.log(`Using default next path: ${nextQuestionKey}`);
  }

  if (nextQuestionKey) {
    console.log(`Found next question: ${nextQuestionKey}`);
    
    const processNextQuestion = (questionKey: string): string => {
      const skipTo = checkSkipConditions(questionKey, questions, responses);
      return skipTo || questionKey;
    };
    
    let finalNextQuestion = nextQuestionKey;
    let skipApplied = true;
    let maxSkips = 10;
    
    while (skipApplied && maxSkips > 0) {
      const newNextQuestion = processNextQuestion(finalNextQuestion);
      skipApplied = newNextQuestion !== finalNextQuestion;
      finalNextQuestion = newNextQuestion;
      maxSkips--;
    }
    
    return finalNextQuestion;
  }
  
  console.error('No next question found');
  return undefined;
};
