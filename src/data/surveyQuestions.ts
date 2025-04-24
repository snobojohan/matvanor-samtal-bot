import { SurveyData } from '@/types/survey';

export const surveyQuestions: SurveyData = {
  welcome: {
    message: "Hej och välkommen till vår undersökning om matvanor! Vi är intresserade av att förstå hur du och din familj hanterar mat i vardagen. Dina svar hjälper oss att förstå verkliga utmaningar och behov. Undersökningen tar cirka 10-15 minuter. Vill du börja?",
    options: ["Nej tack", "Ja, jag vill delta"],
    next_nej_tack: "early_exit",
    next_ja: "intro"
  },
  early_exit: {
    message: "Tack ändå! Om du har några frågor är du välkommen att kontakta oss.",
    end: true
  },
  intro: {
    message: "Tack för att du deltar! Först skulle jag vilja veta lite om dig. Hur ser din familjesituation ut?",
    options: ["Bor ensam", "Sambo/gift utan barn", "Familj med barn", "Har barn vissa veckor", "Annat"],
    next_familj: "teenagers_question",
    next_har: "teenagers_question",
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
    options: ["Grundskola", "Gymnasium", "Högskola/Universitet", "Annan eftergymnasial utbildning"],
    next: "daily_routine"
  },
  daily_routine: {
    message: "Berätta hur en vanlig vecka ser ut hemma hos er när det gäller maten – frukost, lunch, middag.",
    type: "text",
    next: "meal_planning"
  },
  meal_planning: {
    message: "Hur brukar du/ni komma på vad ni ska äta?",
    type: "text",
    next: "decision_making"
  },
  decision_making: {
    message: "Vem bestämmer vad som lagas och handlas?",
    type: "text",
    next: "shopping_frequency"
  },
  shopping_frequency: {
    message: "Hur ofta handlar ni, och hur brukar det gå till?",
    type: "text",
    next: "eating_out"
  },
  eating_out: {
    message: "Hur ofta blir det att ni äter ute eller beställer hem mat i veckorna?",
    type: "text",
    next: "last_meal_planning"
  },
  last_meal_planning: {
    message: "Nu skulle jag vilja höra om några konkreta exempel från din vardag. Kan du berätta om senast ni skulle laga mat – hur visste ni vad ni skulle äta och om ni hade allt hemma?",
    type: "text",
    next: "no_plan_day"
  },
  no_plan_day: {
    message: "Berätta om en dag då det inte fanns någon plan för maten – vad hände då?",
    type: "text",
    next: "no_plan_meals"
  },
  no_plan_meals: {
    message: "Vad åt ni den dagen till frukost/lunch/middag?",
    type: "text",
    next: "no_plan_feelings"
  },
  no_plan_feelings: {
    message: "Var det något som kändes extra rörigt, stressigt eller funkade särskilt bra den dagen?",
    type: "text",
    next: "no_meal_plan"
  },
  no_meal_plan: {
    message: "Nu skulle jag vilja höra om/hur ni matplanerar. Vad gör ni om ni inte vet vad ni ska äta?",
    type: "text",
    next: "meal_facilitation"
  },
  meal_facilitation: {
    message: "Har ni något sätt att underlätta matvardagen?",
    type: "text",
    next: "support_tools"
  },
  support_tools: {
    message: "Använder ni något stöd? App? Lista? Rutiner?",
    type: "text",
    next: "previous_methods"
  },
  previous_methods: {
    message: "Har ni testat någon app, tjänst, matkasse eller metod tidigare för att underlätta matplaneringen?",
    options: ["Ja", "Nej"],
    next_ja: "previous_methods_details",
    next_nej: "change_food_habits"
  },
  previous_methods_details: {
    message: "Vilken app, tjänst eller metod testade ni och hur fungerade det?",
    type: "text",
    next: "still_using"
  },
  still_using: {
    message: "Använder ni den fortfarande?",
    options: ["Ja", "Nej"],
    next_ja: "why_still_using",
    next_nej: "why_stopped"
  },
  why_still_using: {
    message: "Vad är det som gör att ni fortsätter använda den?",
    type: "text",
    next: "change_food_habits"
  },
  why_stopped: {
    message: "Varför slutade ni använda den?",
    type: "text",
    next: "change_food_habits"
  },
  change_food_habits: {
    message: "Nu skulle jag vilja höra om dina tankar kring matvanor och eventuella förändringar. Har du funderat på att ändra något kring maten den senaste tiden?",
    options: ["Ja", "Nej"],
    next_ja: "change_food_habits_details",
    next_nej: "desired_changes"
  },
  change_food_habits_details: {
    message: "Vad handlade det om? Hur tänkte du då?",
    type: "text",
    next: "tried_changes"
  },
  tried_changes: {
    message: "Försökte du ändra matvanor, hur gick det? Vad ändrade du?",
    type: "text",
    next: "kept_habits"
  },
  kept_habits: {
    message: "Har du hållit i de nya vanorna?",
    options: ["Ja", "Delvis", "Nej"],
    next_ja: "how_kept_habits",
    next_delvis: "how_kept_habits",
    next_nej: "why_difficult"
  },
  how_kept_habits: {
    message: "Hur har du lyckats hålla i de nya vanorna?",
    type: "text",
    next: "desired_changes"
  },
  why_difficult: {
    message: "Vad är svårt med att hålla i nya matvanor?",
    type: "text",
    next: "desired_changes"
  },
  desired_changes: {
    message: "Är det något du själv skulle vilja förändra med hur ni äter idag?",
    type: "text",
    next: "priorities"
  },
  priorities: {
    message: "Många försöker tänka mer på hälsa, plånbok eller klimat – är något av det relevant för dig?",
    type: "text",
    next: "other_contacts"
  },
  other_contacts: {
    message: "Vi närmar oss slutet av undersökningen. Finns det någon annan du tycker vi borde prata med om matvanor?",
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
