
import { SurveyData } from '@/types/survey';

export const leftoverQuestions: SurveyData = {
  leftovers_disposition: {
    message: "När det finns matrester hemma, vad är mest troligt att ni gör med dem?",
    type: "multiple_choice",
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
      "Ofta (3-7 ggr/vecka)",
      "Aldrig"
    ],
    next: "recent_leftover_use"
  },
  recent_leftover_use: {
    message: "Berätta om senaste gången ni använde matrester hemma. Vad gjorde ni?",
    type: "text",
    next: "tools_used"
  }
};
