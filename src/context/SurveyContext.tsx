
import React, { createContext, useContext, useState } from 'react';
import { UserResponse } from '@/types/survey';

interface SurveyContextType {
  responses: UserResponse[];
  addResponse: (response: UserResponse) => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function SurveyProvider({ children }: { children: React.ReactNode }) {
  const [responses, setResponses] = useState<UserResponse[]>([]);

  const addResponse = (response: UserResponse) => {
    setResponses((prev) => [...prev, response]);
  };

  return (
    <SurveyContext.Provider value={{ responses, addResponse }}>
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurvey() {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
}
