import { SurveyData } from "@/types/survey";

export const surveyQuestions: SurveyData = {
  welcome: {
    message:
      "Hej och välkommen till vår undersökning om matvanor! Vi är intresserade av att förstå hur du hanterar måltider i vardagen. Undersökningen tar cirka 10-15 minuter. Vill du börja?",
    type: "single_choice",
    options: ["Ja, jag vill delta", "Nej tack"],
    next_ja_jag_vill_delta: "intro",
    next_nej_tack: "early_exit",
  },
  early_exit: {
    message:
      "Tack ändå! Ha en fin dag och hoppas att du får äta mat som du tycker om.",
    end: true,
  },
  intro: {
    message:
      "Tack för att du deltar! Först skulle jag vilja veta lite om dig. Hur ser din familjesituation ut?",
    type: "single_choice",
    options: [
      "Singelhushåll",
      "Sambo/gift utan barn",
      "Familj med barn",
      "Har barn vissa veckor",
      "Annat",
    ],
    next: "living_location",
  },
  living_location: {
    message: "Var bor ni?",
    type: "single_choice",
    options: ["Landsbygd", "Mindre stad", "Storstad"],
    next: "unsure_food_decision",
  },
  unsure_food_decision: {
    message: "När ni senast undrade 'vad ska vi äta idag?' – vad gjorde ni då?",
    type: "text",
    next: "decision_process",
  },
  decision_process: {
    message: "Hur brukar ni göra för att bestämma vad ni ska äta?",
    type: "single_choice",
    options: [
      "Vi hittar på samma dag",
      "Vi planerar ca en vecka i taget",
      "Vi planerar för längre än en vecka",
      "Vi försöker planera men lyckas sällan",
    ],
    next_vi_hittar_pa_samma_dag: "shopping_process",
    next_vi_planerar_ca_en_vecka_i_taget: "meal_planning_last",
    next_vi_planerar_for_langre_an_en_vecka: "meal_planning_last",
    next_vi_forsoker_planera_men_lyckas_sallan: "shopping_process",
  },
  meal_planning_last: {
    message: "Berätta om er senaste måltidsplanering.",
    type: "text",
    next: "inspiration_sources",
  },
  shopping_process: {
    message: "Hur brukar det gå till när ni handlar.",
    type: "text",
    next: "inspiration_sources",
  },
  inspiration_sources: {
    message:
      "Hur brukar ni få idéer och inspiration till middagar? Klicka gärna i fler än ett alternativ.",
    type: "multiple_choice",
    options: [
      "Söker aktivt recept eller tips",
      "Lagar sånt jag redan kan",
      "Frågar andra",
      "Bestämmer spontant i butiken",
      "Annat",
    ],
    next: "week_variation_reason",
  },
  week_variation_reason: {
    skipToIf: [
      {
        question: "intro",
        equals: "singelhushall",
        to: "ease_wishes",
      },
      {
        question: "intro",
        not_equals: "har_barn_vissa_veckor",
        to: "responsibility_distribution",
      },
    ],
    message:
      "När dina veckor ser olika ut – vad är det som förändras kring hur ni ordnar med maten?",
    type: "text",
    next: "responsibility_distribution",
  },
  responsibility_distribution: {
    message: "Hur delar ni upp ansvaret för maten hemma?",
    type: "single_choice",
    options: ["En person tar huvudansvaret", "Vi delar ungefär lika", "Annat"],
    next: "responsibility_coordination_dynamics",
  },
  responsibility_coordination_dynamics: {
    message:
      "Hur brukar ni samordna er i praktiken när det gäller matplanering, handling, matlagning och annat som hör till?",
    type: "text",
    next: "meal_variation_within_household",
  },
  meal_variation_within_household: {
    message:
      "Hur ofta behöver någon i hushållet äta något den egentligen inte är så sugen på, för att det ska passa andras smak och behov?",
    type: "single_choice",
    options: ["Nästan varje dag", "Några gånger i veckan", "Sällan", "Aldrig"],
    next: "children_influence_food_choices",
    next_aldrig: "different_schedules",
  } /*
  "special_diet": {
    "message": "Förekommer det någon typ av specialkost i ert hushåll?",
    "type": "multiple_choice",
    "options": [
      "Allergi eller överkänslighet",
      "Etiska skäl (vegetariskt, veganskt)",
      "Hälsoskäl (t.ex. diabetes, IBS)",
      "Annat",
      "Nej"
    ],
    "next_nej": "other_preferences",
    "next": "special_diet_impact"
  },
  "other_preferences": {
    "message": "Äter alla i hushållet all sorts mat?",
    "type": "text",
    "next": "children_influence_food_choices",
    
  },
  "special_diet_impact": {
    "message": "Hur påverkar det ert sätt att planera och laga mat?",
    "type": "text",
    "next": "children_influence_food_choices"
  },
  */,
  children_influence_food_choices: {
    skipToIf: [
      {
        question: "intro",
        equals: "sambo_gift_utan_barn",
        to: "variation_handling_text",
      },
    ],
    message:
      "Hur mycket påverkar barnens preferenser, behov och eventuella allergier vad ni väljer att laga?",
    type: "single_choice",
    options: ["Väldigt mycket", "Delvis", "Inte särskilt mycket", "Inte alls"],
    next: "variation_handling_text",
  },
  variation_handling_text: {
    message:
      "Hur löser ni det när det uppstår olika behov eller önskemål kring maten?",
    type: "text",
    next: "different_schedules",
  },
  different_schedules: {
    message: "Äter ni oftast tillsammans – eller blir det olika tider?",
    type: "text",
    next: "insecure_cooking",
  },

  insecure_cooking: {
    message: "Upplever du att någon hemma känner sig osäker på att laga mat?",
    type: "single_choice",
    options: ["Ja", "Nej", "Vet inte"],
    next_ja: "insecure_cooking_explanation",
    next: "ease_wishes",
  },
  insecure_cooking_explanation: {
    message: "Vill du berätta lite mer om vad som gör det svårt eller osäkert?",
    type: "text",
    next: "ease_wishes",
  },
  ease_wishes: {
    message: "Finns det något ni önskar var enklare med maten i vardagen?",
    type: "text",
    next: "success_period",
  },
  /*
  "leftovers_disposition": {
    "message": "När det finns matrester hemma, vad är mest troligt att ni gör med dem?",
    "type": "multiple_choice",
    "options": [
      "Slänger",
      "Äter samma rätt igen",
      "Använder i nya rätter",
      "Varierar",
      "Annat"
    ],
    "next": "tools_used"
  },
  "leftovers_reuse_frequency": {
    "message": "Hur ofta använder ni överbliven tillagad mat som ingrediens i nya maträtter?",
    "type": "single_choice",
    "options": [
      "Sällan (1-2 ggr/månad)",
      "Ibland (1-2 ggr/vecka)",
      "Ofta (3-7 ggr/vecka)",
      "Aldrig"
    ],
    "next": "tools_used"
  },≈
  tools_used: {
    message:
      "Finns det något ni använder för att planera eller organisera vardagen kring mat (t.ex. handla, skriva listor, komma ihåg middagsidéer)? Berätta gärna hur ni gör.",
    type: "text",
    next: "success_period",
  },
  */
  success_period: {
    message:
      "Berätta om en period då det fungerade extra bra med matplanering, handling och matlagning i vardagen. Hur gjorde ni då – och varför tror du att det funkade?",
    type: "text",
    next: "tools_during_success",
  },
  tools_during_success: {
    message:
      "Under perioden då det fungerade bra – använde ni någon särskild tjänst eller något verktyg som hjälpte till? (Flera svar möjliga)",
    type: "multiple_choice",
    options: [
      "Matkasse eller recepttjänst",
      "Hemleverans av matvaror",
      "Speciell-app inriktad på mat",
      "Standard-app i telefonen (t.ex. Anteckningar, Påminnelser)",
      "Kalender, Kalkylark eller mail",
      "Annat",
      "Inget särskilt",
    ],
    next_annat: "tools_during_success_other",
    next: "habit_break",
  },
  tools_during_success_other: {
    message: "Vilket annat verktyg eller tjänst använde ni?",
    type: "text",
    next: "habit_break",
  },
  habit_break: {
    message:
      "Har det hänt att ni fallit ur de goda rutinerna? Vad tror du bidrog till det?",
    type: "text",
    next: "habit_restart",
  },
  habit_restart: {
    message:
      "Har ni någon gång lyckats komma tillbaka till fungerande vanor efter en tuffare period? Hur gjorde ni då?",
    type: "text",
    next: "diet_change_considered",
  },
  diet_change_considered: {
    message: "Har ni funderat på att förändra er diet – alltså vad ni äter – den senaste tiden?",
    type: "single_choice",
    options: ["Ja", "Nej"],
    next_ja: "diet_change_combined",
    next: "missed_questions",
  },
  diet_change_combined: {
    message: "Vad vill ni förändra – och finns det något särskilt mål eller skäl bakom?",
    type: "text",
    next: "missed_questions",
  },
  missed_questions: {
    message: "Är det något du tycker att vi glömt att fråga om?",
    type: "text",
    next: "thank_you",
  },
  thank_you: {
    message:
      "Tack så mycket för dina svar! De kommer att hjälpa oss att bättre förstå hur människor hanterar mat i vardagen.",
    end: true,
  },
};

function generateMermaidFlowchart(surveyData) {
  let chart = "flowchart TD\n";

  // Add nodes
  Object.keys(surveyData).forEach((questionId) => {
    chart += `    ${questionId}["${surveyData[questionId].message.substring(
      0,
      30
    )}..."]\n`;
  });

  // Add connections
  Object.keys(surveyData).forEach((questionId) => {
    const question = surveyData[questionId];

    // Handle standard next property
    if (question.next && !question.end) {
      chart += `    ${questionId} --> ${question.next}\n`;
    }

    // Handle conditional next properties (next_*)
    Object.keys(question).forEach((key) => {
      if (key.startsWith("next_") && key !== "next") {
        const optionLabel = key.replace("next_", "").substring(0, 10);
        chart += `    ${questionId} -->|${optionLabel}| ${question[key]}\n`;
      }
    });

    // Handle end states
    if (question.end) {
      chart += `    ${questionId} --> END\n`;
    }
  });

  return chart;
}

// Usage:
// const diagram = generateMermaidFlowchart(surveyQuestions);
// console.log(diagram);
