import axios from "../API/axios";
import useAuth from "./useAuth";
import useToast from "./useToast";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const{setToastMessage}= useToast()
  const refresh = async () => {
    try {
      const resp = await axios.get("/api/auth/refresh");
      setAuth(resp.data.token);
      return resp.data.token;
    } catch (error) {
      if (error.response) {
        setToastMessage({message:`${error.response.data.message}`,variant:"danger"} )
      } else {
        setToastMessage({message:`${error}`,variant:"danger"} )
      }
    }
  };
  return refresh;
};

export default useRefreshToken;
