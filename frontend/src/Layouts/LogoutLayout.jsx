import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { Navigate } from "react-router-dom";
import useUserAxios from "../hooks/useUserAxios";
import useToast from "../hooks/useToast";
import useAuth from "../hooks/useAuth";

function Logout() {
  const axios= useUserAxios()
  const{setToastMessage}= useToast()
  const { setAuth } = useAuth()
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const logout = async() => {
   try {
    await axios.get("/api/auth/logout")
    setAuth({})
    
   } catch (error) {
    
    setToastMessage({message:`${ String(error)}`,variant:"danger"} )
   }finally{
    setIsLoggedOut(true);
   }
   
  };
  useEffect(() => {
    logout();
  }, []);
  return !isLoggedOut ? (
    <Spinner />
  ) : (
    <Navigate to={"/login"} state={{ message: "Logged out" }} />
  );
}

export default Logout;
