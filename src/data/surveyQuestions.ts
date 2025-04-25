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
    next: "difficult_food_day"
  },
  difficult_food_day: {
    message: "Berätta om en dag det var svårt att komma på vad ni skulle äta.",
    type: "text",
    next: "meal_planning_frequency"
  },
  meal_planning_frequency: {
    message: "Hur brukar ni planera era måltider?",
    options: ["Planerar inte", "Dag för dag", "Veckovis", "Månadsvis", "Annat"],
    type: "single_choice",
    next_planerarinte: "shopping_process",
    next_annat: "meal_planning_last_week",
    next: "ease_wishes"
  },
  meal_planning_last_week: {
    message: "Berätta om er måltidsplanering förra veckan.",
    type: "text",
    next: "ease_wishes"
  },
  shopping_process: {
    message: "Berätta om hur det brukar gå till när ni handlar.",
    type: "text",
    next: "ease_wishes"
  },
  ease_wishes: {
    message: "Finns det något ni önskar var enklare med maten i vardagen?",
    type: "text",
    next: "success_period"
  },
  success_period: {
    message: "Berätta om någon särskild period ni lyckats extra bra med handling och matlagning. Vad var nyckel då om ni får gissa?",
    type: "text",
    next: "leftovers_disposition"
  },
  leftovers_disposition: {
    message: "När det finns matrester hemma, vad är mest troligt att ni gör med dem?",
    options: ["Slänger", "Äter samma rätt igen", "Använder i nya rätter", "Varierar", "Annat"],
    type: "single_choice",
    next_anvanderinyaratter: "leftovers_reuse_frequency",
    next_varierar: "leftovers_reuse_frequency",
    next: "leftovers_handling_explanation"
  },
  leftovers_reuse_frequency: {
    message: "Hur ofta använder ni överbliven tillagad mat som ingrediens i nya maträtter?",
    options: ["Sällan (1-2 ggr/månad)", "Ibland (1-2 ggr/vecka)", "Ofta (3-5 ggr/vecka)", "Nästan dagligen"],
    type: "single_choice",
    next: "leftovers_handling_explanation"
  },
  leftovers_handling_explanation: {
    message: "Berätta lite om hur ni hanterar matrester i ert hushåll från en dag till en annan.",
    type: "text",
    next: "tools_used"
  },
  tools_used: {
    message: "Vilka tjänster, appar eller verktyg (papper och penna räknas) använder ni för att underlätta i vardagen?",
    type: "text",
    next: "meal_kit_service"
  },
  meal_kit_service: {
    message: "Har ni testat matkassar eller någon annan betald tjänst för att underlätta matplanering eller matlagning?",
    options: ["Ja", "Nej"],
    type: "single_choice",
    next_ja: "meal_kit_experience",
    next_nej: "meal_kit_not_used_reason"
  },
  meal_kit_experience: {
    message: "Vad var det? Funkade det bra?",
    type: "text",
    next: "meal_kit_still_using"
  },
  meal_kit_still_using: {
    message: "Använder ni det fortfarande?",
    options: ["Ja", "Nej"],
    type: "single_choice",
    next: "diet_change_considered"
  },
  meal_kit_not_used_reason: {
    message: "Varför slutade ni använda det?",
    type: "text",
    next: "diet_change_considered"
  },
  diet_change_considered: {
    message: "Har ni funderat på att förändra hur ni äter den senaste tiden?",
    options: ["Ja", "Nej"],
    type: "single_choice",
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
    options: [
      "Jag har gjort en förändring och håller i den",
      "Jag försökte men det höll inte",
      "Jag har inte gjort någon förändring än"
    ],
    type: "single_choice",
    next_jagforsoktemendethallinte: "diet_change_challenges",
    next_jagharintegjortan: "diet_change_challenges",
    next: "important_aspects"
  },
  diet_change_challenges: {
    message: "Vad var det som gjorde att det inte blev av eller att det inte höll i sig?",
    type: "text",
    next: "important_aspects"
  },
  important_aspects: {
    message: "Är något av det här viktigt för dig just nu? Välj gärna flera",
    options: [
      "Äta nyttigare",
      "Minska matkostnader",
      "Minska klimatpåverkan",
      "Slippa vardagsstress",
      "Inget",
      "Annat"
    ],
    type: "multiple_choice",
    next: "missed_questions"
  },

  missed_questions: {
    message: "Är det något du tycker att vi glömt att fråga om?",
    type: "text",
    next: "thank_you"
  },
  thank_you: {
    message: "Tack så mycket för dina svar! De kommer att hjälpa oss att bättre förstå hur människor hanterar mat i vardagen.",
    end: true
  }
};
