import { createContext, useState } from "react";
const ErrorContext = createContext(null);
export const ErrorContextProvider = ({ children }) => {
  const [error, setError] = useState();
  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorContext;
