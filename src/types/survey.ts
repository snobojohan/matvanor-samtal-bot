
export type SurveyQuestion = {
  message: string;
  options?: string[];
  type?: "text";
  next?: string;
  end?: boolean;
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
