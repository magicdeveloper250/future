import { useContext } from "react";
import SearchContext from "../contexts/SearchContext";

function useSearch() {
  return useContext(SearchContext);
}

export default useSearch;
