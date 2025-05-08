
import { SurveyData } from '@/types/survey';

export const demographicQuestions: SurveyData = {
  intro: {
    message: "Tack för att du deltar! Först skulle jag vilja veta lite om dig. Hur ser din familjesituation ut?",
    type: "single_choice",
    options: ["Singelhushåll", "Sambo/gift utan barn", "Familj med barn", "Har barn vissa veckor", "Annat"],
    next_familj_med_barn: "teenagers_question",
    next_har_barn_vissa_veckor: "teenagers_question",
    next: "living_location",
    skipToIf: [
      { question: "intro", equals: "singelhushall", to: "ease_wishes" }
    ]
  },
  teenagers_question: {
    message: "Finns det tonåringar i hushållet?",
    type: "single_choice",
    options: ["Ja", "Nej"],
    next: "living_location"
  },
  living_location: {
    message: "Var bor du?",
    type: "single_choice",
    options: ["Landsbygd", "Mindre stad", "Storstad"],
    next: "education_level"
  }
};
