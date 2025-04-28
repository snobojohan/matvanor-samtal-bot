
import { SurveyData } from '@/types/survey';

export const dietaryQuestions: SurveyData = {
  diet_change_considered: {
    message: "Har ni funderat på att förändra hur ni äter den senaste tiden?",
    type: "single_choice",
    options: ["Ja", "Nej"],
    next_ja: "diet_change_goals",
    next: "important_aspects"
  },
  diet_change_goals: {
    message: "Vad handlade det om, vad har ni för mål?",
    type: "text",
    next: "diet_change_progress"
  },
  diet_change_progress: {
    message: "Hur har det gått hittills?",
    type: "single_choice",
    options: [
      "Har gjort en förändring och håller i den",
      "Försökte förändra men det höll inte",
      "Har inte gjort någon förändring än"
    ],
    next_jag_forsokte_men_det_holl_inte: "diet_change_challenges",
    next_jag_har_inte_gjort_nagon_forandring_an: "diet_change_challenges",
    next: "important_aspects"
  },
  diet_change_challenges: {
    message: "Vad var det som gjorde att det inte blev av eller att det inte höll i sig?",
    type: "text",
    next: "important_aspects"
  },
  important_aspects: {
    message: "Är något av det här viktigt för dig just nu? Välj gärna flera",
    type: "multiple_choice",
    options: ["Äta nyttigare", "Äta billigare", "Minska klimatpåverkan", "Minska stress", "Annat"],
    next: "missed_questions"
  },
  missed_questions: {
    message: "Är det något du tycker att vi glömt att fråga om?",
    type: "text",
    next: "thank_you"
  }
};
