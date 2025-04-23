
import React from 'react';
import { Link } from 'react-router-dom';

const ChatHeader = () => (
  <div className="sticky top-0 z-10 bg-chatbg pr-4 pl-4">
    <div className="pb-2 pt-2 max-w-[672px] mx-auto w-full flex justify-between items-center">
      <h1 className="text-xl font-black font-nunito">Undersökning om matvanor</h1>
      <Link 
        to="/visualization" 
        className="text-sm text-[#2D9CDB] hover:underline"
      >
        View Flow
      </Link>
    </div>
  </div>
);

export default ChatHeader;
