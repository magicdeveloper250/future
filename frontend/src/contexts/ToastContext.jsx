import { Children, createContext, useState } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toastMessage, setToastMessage] = useState();
  return (
    <ToastContext.Provider value={{ toastMessage, setToastMessage }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContext;
