export type QuestionType = "text" | "single_choice" | "multiple_choice";

export type SkipCondition = {
  question: string;
  equals?: string;
  not_equals?: string;
  to: string;
};

export type SurveyQuestion = {
  message: string;
  options?: string[];
  type?: QuestionType;
  next?: string;
  end?: boolean;
  skipToIf?: SkipCondition[];
  [key: string]: string | string[] | boolean | QuestionType | SkipCondition[] | undefined;
};

export type SurveyData = {
  [key: string]: SurveyQuestion;
};

export type UserResponse = {
  questionId: string;
  answer: string;
  timestamp: string;
};
