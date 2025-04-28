
import { SurveyData } from '@/types/survey';

export const mealServiceQuestions: SurveyData = {
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
    message: "Vilken tjänst använder ni mest, vad är fördelarna och finns det några nackdelar?",
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
  }
};
