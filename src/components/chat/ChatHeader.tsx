import React, { useEffect, useState } from 'react';
import { getUrlParameter } from '@/utils/urlParams';

const ChatHeader = () => {
  const [version, setVersion] = useState<string>('1');
  
  useEffect(() => {
    // Get version from URL params
    setVersion(getUrlParameter('version', '1'));
  }, []);
  
  return (
    <div className="sticky top-0 z-10 bg-chatbg pr-4 pl-4">
      <div className="pb-2 pt-2 max-w-[672px] mx-auto w-full flex justify-between items-center">
        <h1 className="text-xl font-black font-nunito">Undersökning om matvanor</h1>
        {version !== '1' && (
          <span className="bg-chatblue text-white px-2 py-1 rounded text-xs">
            Version {version}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
