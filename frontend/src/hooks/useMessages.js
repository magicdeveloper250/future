import { useContext } from "react";
import MessagesContext from "../contexts/MessagesContext";

function useMessages() {
  return useContext(MessagesContext);
}

export default useMessages;
