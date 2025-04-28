import { SurveyData } from '@/types/survey';

export const surveyQuestions: SurveyData = {
  welcome: {
    message: "Hej och välkommen till vår undersökning om matvanor! Vi är intresserade av att förstå hur du och din familj hanterar mat i vardagen. Dina svar hjälper oss att förstå verkliga utmaningar och behov. Undersökningen tar cirka 5-10 minuter. Vill du börja?",
    type: "single_choice",
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
    type: "single_choice",
    options: ["Singelhushåll", "Sambo/gift utan barn", "Familj med barn", "Har barn vissa veckor", "Annat"],
    next_familjmedbarn: "teenagers_question",
    next_harbarnvissaveckor: "teenagers_question",
    next: "living_location"
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
  },
  education_level: {
    message: "Vilken är din högsta avslutade utbildning?",
    type: "single_choice",
    options: ["Grundskola", "Gymnasium", "Högskola/Universitet", "Annan utbildning"],
    next: "unsure_food_decision"
  },

  // ——— Här börjar den nya MD-sektionen ———

  unsure_food_decision: {
    message: "När du senast undrade ‘vad ska vi äta idag?’ – vad gjorde du/ni då?",
    type: "text",
    next: "decision_process"
  },
  decision_process: {
    message: "Hur brukar ni göra när ni bestämmer vad ni ska äta?",
    type: "single_choice",
    options: [
      "Vi hittar på samma dag",
      "Vi planerar några dagar i taget",
      "Vi planerar en vecka i taget",
      "Vi planerar längre än en vecka i taget",
      "Vi planerar inte alls"
    ],
    next_vi_planerar_nagra_dagar_i_taget: "meal_planning_last",
    next_vi_planerar_en_vecka_i_taget: "meal_planning_last",
    next_vi_planerar_langre_an_en_vecka_i_taget: "meal_planning_last",
    next_vi_hittar_pa_samma_dag: "shopping_process",
    next_vi_planerar_inte_allt: "shopping_process"
  },
  meal_planning_last: {
    message: "Berätta om er senaste måltidsplanering.",
    type: "text",
    next: "inspiration_sources"
  },
  shopping_process: {
    message: "Berätta om hur det brukar gå till när ni handlar.",
    type: "text",
    next: "inspiration_sources"
  },
  inspiration_sources: {
    message: "Hur brukar ni få idéer och inspiration till middagar? Klicka gärna i fler än ett alternativ.",
    type: "multiple_choice",
    options: [
      "Jag söker aktivt recept eller tips (bok, blogg, sociala medier osv)",
      "Jag brukar laga sånt jag redan kan och tänker ut själv",
      "Jag frågar andra (familj, vänner)",
      "Jag bestämmer spontant i butiken",
      "Annat"
    ],
    next: "responsibility_distribution"
  },
  responsibility_distribution: {
    message: "Hur delar ni upp ansvaret för maten hemma?",
    type: "single_choice",
    options: [
      "En person tar huvudansvaret",
      "Vi delar ungefär lika",
      "Vi turas om",
      "Annat"
    ],
    next: "insecure_cooking"
  },
  insecure_cooking: {
    message: "Upplever du att någon hemma känner sig osäker på att laga mat?",
    type: "single_choice",
    options: ["Ja", "Nej", "Vet inte"],
    next_ja: "insecure_cooking_explanation",
    next: "ease_wishes"
  },
  insecure_cooking_explanation: {
    message: "Vill du berätta lite mer om vad som gör det svårt eller osäkert?",
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
    type: "single_choice",
    options: ["Slänger", "Äter samma rätt igen", "Använder i nya rätter", "Varierar", "Annat"],
    next_anvander_i_nya_ratter: "leftovers_reuse_frequency",
    next_varierar: "leftovers_reuse_frequency",
    next: "recent_leftover_use"
  },
  leftovers_reuse_frequency: {
    message: "Hur ofta använder ni överbliven tillagad mat som ingrediens i nya maträtter?",
    type: "single_choice",
    options: [
      "Sällan (1-2 ggr/månad)",
      "Ibland (1-2 ggr/vecka)",
      "Ofta (3-5 ggr/vecka)",
      "Nästan dagligen"
    ],
    next: "recent_leftover_use"
  },
  recent_leftover_use: {
    message: "Berätta om senaste gången ni använde matrester hemma. Vad gjorde ni?",
    type: "text",
    next: "tools_used"
  },
  tools_used: {
    message: "Finns det något ni använder för att planera eller organisera vardagen kring mat (t.ex. handla, skriva listor, komma ihåg middagsidéer)? Berätta gärna hur ni gör.",
    type: "text",
    next: "meal_kit_service"
  },
  meal_kit_service: {
    message: "Har du någon gång använt en tjänst du betalat för, som t.ex. matkasse, receptabonnemang eller hemleverans, för att göra matplanering eller matlagning enklare?",
    type: "single_choice",
    options: [
      "Ja, använder regelbundet",
      "Ja, har testat någon gång",
      "Nej, aldrig testat"
    ],
    next_ja_anvander_regelbundet: "meal_kit_regular_use",
    next_ja_har_testat_nagon_gang: "meal_kit_tried_once",
    next: "diet_change_considered"
  },
  meal_kit_regular_use: {
    message: "Vilken tjänst använder ni mest och hur underlättar den erat liv?",
    type: "text",
    next: "diet_change_considered"
  },
  meal_kit_tried_once: {
    message: "Varför slutade ni använda tjänsten?",
    type: "multiple_choice",
    options: [
      "Blev för dyrt",
      "Blev för mycket/komplicerat",
      "Passade inte vår smak",
      "För lite variation i maten",
      "Vi föredrog att välja själva",
      "Livssituationen ändrades (t.ex. flytt, barn, nytt jobb)",
      "Annat"
    ],
    next: "meal_kit_churn_explanation"
  },
  meal_kit_churn_explanation: {
    message: "Berätta lite mer om vilken tjänst och varför det inte funkade för er?",
    type: "text",
    next: "diet_change_considered"
  },
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
      "Jag har gjort en förändring och håller i den",
      "Jag försökte men det höll inte",
      "Jag har inte gjort någon förändring än"
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
  },
  thank_you: {
    message: "Tack så mycket för dina svar! De kommer att hjälpa oss att bättre förstå hur människor hanterar mat i vardagen.",
    end: true
  }
};
