
export type QuestionType = "text" | "single_choice" | "multiple_choice";

export type SkipCondition = {
  question: string;
  equals: string;
  to: string;
};

export type SurveyQuestion = {
  message: string;
  options?: string[];
  type?: QuestionType;
  next?: string;
  end?: boolean;
  skipToIf?: SkipCondition[];
  [key: string]: any;
};

export type SurveyData = {
  [key: string]: SurveyQuestion;
};

export type UserResponse = {
  questionId: string;
  answer: string;
  timestamp: string;
};
