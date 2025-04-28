
import { SurveyData } from '@/types/survey';

export const welcomeQuestions: SurveyData = {
  welcome: {
    message: "Hej och välkommen till vår undersökning om matvanor! Vi är intresserade av att förstå hur du och din familj hanterar mat i vardagen. Dina svar hjälper oss att förstå verkliga utmaningar och behov. Undersökningen tar cirka 5-10 minuter. Vill du börja?",
    type: "single_choice",
    options: ["Ja, jag vill delta", "Nej tack"],
    next_ja_jag_vill_delta: "intro",
    next_nej_tack: "early_exit"
  },
  early_exit: {
    message: "Tack ändå! Om du har några frågor är du välkommen att kontakta oss.",
    end: true
  },
  thank_you: {
    message: "Tack så mycket för dina svar! De kommer att hjälpa oss att bättre förstå hur människor hanterar mat i vardagen.",
    end: true
  }
};
