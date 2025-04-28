
import { SurveyData } from '@/types/survey';

export const foodPlanningQuestions: SurveyData = {
  unsure_food_decision: {
    message: "När du senast undrade 'vad ska vi äta idag?' – vad gjorde du/ni då?",
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
    next_vi_hittar_pa_samma_dag: "shopping_process",
    next_vi_planerar_nagra_dagar_i_taget: "meal_planning_last",
    next_vi_planerar_en_vecka_i_taget: "meal_planning_last",
    next_vi_planerar_langre_an_en_vecka_i_taget: "meal_planning_last",
    next_vi_planerar_inte_alls: "shopping_process"
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
  tools_used: {
    message: "Finns det något ni använder för att planera eller organisera vardagen kring mat (t.ex. handla, skriva listor, komma ihåg middagsidéer)? Berätta gärna hur ni gör.",
    type: "text",
    next: "meal_kit_service"
  }
};
