
import { SurveyProvider } from '@/context/SurveyContext';
import ChatBot from '@/components/ChatBot';
import { useEffect } from 'react';
import { getUrlParameter } from '@/utils/urlParams';

const Index = () => {
  // Add logging to check if the component is rendering
  useEffect(() => {
    console.log('Index page rendered');
    
    // Check for URL parameters that might be used for survey configuration
    const surveyVersion = getUrlParameter('version');
    if (surveyVersion) {
      console.log('Survey version from URL:', surveyVersion);
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-chatbg">
      <SurveyProvider>
        <ChatBot />
      </SurveyProvider>
    </div>
  );
};

export default Index;
