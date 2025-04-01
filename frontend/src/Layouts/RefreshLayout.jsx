import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import { Outlet } from "react-router-dom";
import useToast from "../hooks/useToast";
function RefreshLayout() {
  const [refreshing, setRefreshing] = useState(true);
  const { auth } = useAuth();
  const{setToastMessage}= useToast()
  const refreshToken = useRefreshToken();
  const refresh = async () => {
    try {
      await refreshToken();
    } catch (error) {
      
        setToastMessage({message:`${error.message}`,variant:"danger"} )
    } finally {
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    if (!auth) {
      refresh();
    } else {
      setRefreshing(false);
    }
  }, []);
  return refreshing ? (
    <center>
      <div className="spinner-border" role="status">
        <span className="sr-only"></span>
      </div>
    </center>
  ) : (
    <Outlet />
  );
}

export default RefreshLayout;
