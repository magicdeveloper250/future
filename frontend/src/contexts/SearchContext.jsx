import { createContext, useState } from "react";

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  return (
    <SearchContext.Provider value={{ products, setProducts }}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
