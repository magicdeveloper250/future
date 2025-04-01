import { useContext } from "react";
import ToastContext from "../Contexts/ToastContext";

function useToast() {
  return useContext(ToastContext);
}

export default useToast;
