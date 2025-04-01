import { useContext } from "react";
import userSessionContext from "../contexts/userSessionContext";
const useAuth = () => {
  return useContext(userSessionContext);
};

export default useAuth;
