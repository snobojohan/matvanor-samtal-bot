import { SurveyProvider } from '@/context/SurveyContext';
import ChatBot from '@/components/ChatBot';
import { useEffect } from 'react';
import { getUrlParameter } from '@/utils/urlParams';

const Index = () => {
  
  return (
    <SurveyProvider>
      <ChatBot />
    </SurveyProvider>
  );
};

export default Index;
