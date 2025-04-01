import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Messages from "../components/Messages";
 

const MessagePage = () => {
  return (
    <div className="flex">

      <Sidebar />
      <div className="flex-1 bg-gray-100">
   
        <Header />

        <div className="p-4 flex">
          <Messages />
        </div>
        
      </div>
    </div>
  );
};

export default MessagePage;
