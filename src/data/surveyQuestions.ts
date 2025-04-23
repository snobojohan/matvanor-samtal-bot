import { SurveyData } from '@/types/survey';

export const surveyQuestions: SurveyData = {
  welcome: {
    message: "Hej och välkommen till vår undersökning om matvanor! Vi är intresserade av att förstå hur du och din familj hanterar mat i vardagen. Dina svar hjälper oss att förstå verkliga utmaningar och behov. Undersökningen tar cirka 10-15 minuter. Vill du börja?",
    options: ["Ja, jag vill delta", "Nej tack"],
    next_ja: "intro",
    next_nej: "early_exit",
    next: "intro"
  },
  early_exit: {
    message: "Tack ändå! Om du har några frågor är du välkommen att kontakta oss.",
    end: true
  },
  intro: {
    message: "Tack för att du deltar! Först skulle jag vilja veta lite om dig. Hur ser din familjesituation ut?",
    options: ["Bor ensam", "Sambo/gift utan barn", "Familj med barn", "Har barn vissa veckor", "Annat"],
    next_bor: "living_location",
    next_sambo: "living_location",
    next_familj: "teenagers_question",
    next_har: "teenagers_question",
    next_annat: "living_location",
    next: "living_location"
  },
  living_location: {
    message: "Var bor du?",
    options: ["Storstad", "Mindre stad", "Landsbygd"],
    next_storstad: "income",
    next_mindre: "income",
    next_landsbygd: "income",
    next: "income"
  },
  income: {
    message: "Ungefär hur hög är din hushållsinkomst per månad?",
    options: ["Under 25 000 kr", "25 000 - 40 000 kr", "40 000 - 60 000 kr", "Över 60 000 kr"],
    next_under: "food_planning",
    next_25: "food_planning",
    next_40: "food_planning",
    next_over: "food_planning",
    next: "food_planning"
  },
  food_planning: {
    message: "Hur planerar du dina måltider?",
    options: ["Veckoplanering", "Några dagar i förväg", "Dagligen", "Improviserar"],
    next_veckoplanering: "shopping_frequency",
    next_några: "shopping_frequency",
    next_dagligen: "shopping_frequency",
    next_improviserar: "shopping_frequency",
    next: "shopping_frequency"
  },
  shopping_frequency: {
    message: "Hur ofta handlar du mat?",
    options: ["Varje dag", "Flera gånger i veckan", "En gång i veckan", "Sällan"],
    next_varje: "food_waste",
    next_flera: "food_waste",
    next_en: "food_waste",
    next_sällan: "food_waste",
    next: "food_waste"
  },
  food_waste: {
    message: "Slänger du ofta mat?",
    options: ["Ja, ofta", "Ibland", "Sällan", "Aldrig"],
    next_ja: "reasons_for_waste",
    next_ibland: "reasons_for_waste",
    next_sällan: "cooking_skills",
    next_aldrig: "cooking_skills",
    next: "cooking_skills"
  },
  reasons_for_waste: {
    message: "Varför slänger du mat?",
    options: ["För mycket inköp", "Dålig planering", "Mat blir dålig", "Rester äts inte"],
    next_för: "cooking_skills",
    next_dålig: "cooking_skills",
    next_mat: "cooking_skills",
    next_rester: "cooking_skills",
    next: "cooking_skills"
  },
  cooking_skills: {
    message: "Hur skulle du beskriva dina matlagningskunskaper?",
    options: ["Avancerad", "Bekväm", "Grundläggande", "Inga"],
    next_avancerad: "time_for_cooking",
    next_bekväm: "time_for_cooking",
    next_grundläggande: "time_for_cooking",
    next_inga: "time_for_cooking",
    next: "time_for_cooking"
  },
  time_for_cooking: {
    message: "Hur mycket tid lägger du på matlagning per dag?",
    options: ["Mindre än 30 min", "30-60 min", "1-2 timmar", "Mer än 2 timmar"],
    next_mindre: "eating_habits",
    next_30: "eating_habits",
    next_1: "eating_habits",
    next_mer: "eating_habits",
    next: "eating_habits"
  },
  eating_habits: {
    message: "Hur ofta äter du hemma?",
    options: ["Varje dag", "Mest hemma", "Mest ute", "Aldrig hemma"],
    next_varje: "food_preferences",
    next_mest: "food_preferences",
    next_ute: "food_preferences",
    next_aldrig: "food_preferences",
    next: "food_preferences"
  },
  food_preferences: {
    message: "Har du några speciella kostpreferenser eller allergier?",
    options: ["Vegetariskt", "Veganskt", "Glutenfritt", "Laktosfritt", "Annat", "Inga"],
    next_vegetariskt: "organic_food",
    next_veganskt: "organic_food",
    next_glutenfritt: "organic_food",
    next_laktosfritt: "organic_food",
    next_annat: "organic_food",
    next_inga: "organic_food",
    next: "organic_food"
  },
  organic_food: {
    message: "Hur viktigt är ekologisk mat för dig?",
    options: ["Mycket viktigt", "Viktigt", "Inte så viktigt", "Inte alls viktigt"],
    next_mycket: "food_information",
    next_viktigt: "food_information",
    next_inte: "food_information",
    next: "food_information"
  },
  food_information: {
    message: "Hur mycket information läser du om maten du köper?",
    options: ["Alltid", "Ofta", "Ibland", "Aldrig"],
    next_alltid: "shopping_list",
    next_ofta: "shopping_list",
    next_ibland: "shopping_list",
    next_aldrig: "shopping_list",
    next: "shopping_list"
  },
  shopping_list: {
    message: "Använder du inköpslista?",
    options: ["Alltid", "Ofta", "Ibland", "Aldrig"],
    next_alltid: "budget",
    next_ofta: "budget",
    next_ibland: "budget",
    next_aldrig: "budget",
    next: "budget"
  },
  budget: {
    message: "Har du en budget för matinköp?",
    options: ["Ja", "Nej"],
    next_ja: "teenagers_question",
    next_nej: "teenagers_question",
    next: "teenagers_question"
  },
  teenagers_question: {
    message: "Har du tonåringar i hushållet?",
    options: ["Ja", "Nej"],
    next_ja: "teenagers_influence",
    next_nej: "cooking_together",
    next: "cooking_together"
  },
  teenagers_influence: {
    message: "Påverkar tonåringarna matinköpen?",
    options: ["Ja, mycket", "Ja, lite", "Inte alls"],
    next_ja: "cooking_together",
    next_inte: "cooking_together",
    next: "cooking_together"
  },
  cooking_together: {
    message: "Lagrar ni mat tillsammans?",
    options: ["Ja, ofta", "Ibland", "Sällan", "Aldrig"],
    next_ja: "satisfaction",
    next_ibland: "satisfaction",
    next_sällan: "satisfaction",
    next_aldrig: "satisfaction",
    next: "satisfaction"
  },
  satisfaction: {
    message: "Är du nöjd med era matvanor?",
    options: ["Ja, mycket", "Nöjd", "Inte nöjd", "Mycket missnöjd"],
    next_ja: "suggestions",
    next_nöjd: "suggestions",
    next_inte: "suggestions",
    next_mycket: "suggestions",
    next: "suggestions"
  },
  suggestions: {
    message: "Har du förslag på hur vi kan hjälpa dig med dina matvanor?",
    type: "text",
    next: "end_message"
  },
  end_message: {
    message: "Tack för din medverkan!",
    end: true
  }
};
