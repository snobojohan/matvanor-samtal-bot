
import { SurveyData } from '@/types/survey';

export const surveyQuestions: SurveyData = {
  welcome: {
    message: "Hej och välkommen till vår undersökning om matvanor! Vi är intresserade av att förstå hur du och din familj hanterar mat i vardagen. Dina svar hjälper oss att förstå verkliga utmaningar och behov. Undersökningen tar cirka 10-15 minuter. Vill du börja?",
    options: ["Ja, jag vill delta", "Nej tack"],
    next_ja: "intro",
    next_nej_tack: "early_exit",
    next: "intro"
  },
  // ... add all the other questions here following the same pattern
};
