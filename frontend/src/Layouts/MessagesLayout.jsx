import { useEffect } from "react";
import { io } from "socket.io-client";
import { Outlet } from "react-router";
import useMessages from "../hooks/useMessages";

function MessagesLayout() {
    const{ setNewMessage}= useMessages()
    useEffect(() => {
      const connection = io.connect(`${import.meta.env.VITE_SERVER_URL}`);
      connection.on("connect", () => console.log("✅Connected"));
      connection.on("disconnect", () => console.log("❌Disconnected"));
      connection.on("newMessage", (message)=>{
        if(message?.message)
            setNewMessage(message)

      });
      return () => connection.disconnect();
    }, []);
  return <Outlet />
  
}

export default MessagesLayout;




 
