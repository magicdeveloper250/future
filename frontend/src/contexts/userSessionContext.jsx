import { createContext, useState } from "react";

const userSessionContext = createContext({});
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState();
  return (
    <userSessionContext.Provider value={{ auth, setAuth }}>
      {children}
    </userSessionContext.Provider>
  );
};
export default userSessionContext;
