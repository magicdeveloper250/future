import { useContext } from "react";
import ErrorContext from "../Contexts/ErrorContext";

function useError() {
  return useContext(ErrorContext);
}

export default useError;
