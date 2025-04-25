import { SurveyData } from '@/types/survey';

export const surveyQuestions: SurveyData = {
  welcome: {
    message: "Hej och välkommen till vår undersökning om matvanor! Vi är intresserade av att förstå hur du och din familj hanterar mat i vardagen. Dina svar hjälper oss att förstå verkliga utmaningar och behov. Undersökningen tar cirka 5-10 minuter. Vill du börja?",
    options: ["Ja, jag vill delta", "Nej tack"],
    next_jajagvilldelta: "intro",
    next_nejtack: "early_exit"
  },
  early_exit: {
    message: "Tack ändå! Om du har några frågor är du välkommen att kontakta oss.",
    end: true
  },
  intro: {
    message: "Tack för att du deltar! Först skulle jag vilja veta lite om dig. Hur ser din familjesituation ut?",
    options: ["Singelhushåll", "Sambo/gift utan barn", "Familj med barn", "Har barn vissa veckor", "Annat"],
    next_familjmedbarn: "teenagers_question",
    next_harbarnvissaveckor: "teenagers_question",
    next: "living_location"
  },
  teenagers_question: {
    message: "Finns det tonåringar i hushållet?",
    options: ["Ja", "Nej"],
    next: "living_location"
  },
  living_location: {
    message: "Var bor du?",
    options: ["Landsbygd", "Mindre stad", "Storstad"],
    next: "education_level"
  },
  education_level: {
    message: "Vilken är din högsta avslutade utbildning?",
    options: ["Grundskola", "Gymnasium", "Högskola/Universitet", "Annan utbildning"],
    next: "food_ideas"
  },
  food_ideas: {
    message: "Hur brukar du/ni komma på vad ni ska äta?",
    type: "text",
    next: "missed_questions"
  },
  missed_questions: {
    message: "Är det något du tycker att vi glömt att fråga om?",
    type: "text",
    next: "thank_you"
  },
  thank_you: {
    message: "Tack så mycket för dina svar! De kommer att hjälpa oss att bättre förstå hur människor hanterar mat i vardagen. Om du har några frågor eller vill lägga till något, är du välkommen att kontakta oss.",
    end: true
  }
};
