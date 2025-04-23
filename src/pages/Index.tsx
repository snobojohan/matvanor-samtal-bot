
import { SurveyProvider } from '@/context/SurveyContext';
import ChatBot from '@/components/ChatBot';

const Index = () => {
  return (
    <SurveyProvider>
      <ChatBot />
    </SurveyProvider>
  );
};

export default Index;
