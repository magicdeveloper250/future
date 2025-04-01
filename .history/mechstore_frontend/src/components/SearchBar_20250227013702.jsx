import React, { useState, useRef, useEffect } from 'react';
import { Search,  Info } from 'lucide-react';
import useSearch from '../hooks/useSearch';
import { Link } from 'react-router';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { products, isLoading } = useSearch();
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      const resultItems = resultsRef.current?.querySelectorAll('a');
      if (!resultItems?.length) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        
        const currentIndex = Array.from(resultItems).findIndex(item => item === document.activeElement);
        let nextIndex;
        
        if (e.key === 'ArrowDown') {
          nextIndex = currentIndex < 0 || currentIndex >= resultItems.length - 1 ? 0 : currentIndex + 1;
        } else {
          nextIndex = currentIndex <= 0 ? resultItems.length - 1 : currentIndex - 1;
        }
        
        resultItems[nextIndex].focus();
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const filteredResults = products?.filter(product =>
    product?.productName?.toLowerCase().includes(query.toLowerCase())
  ) || [];

  const handleSearch = (value) => {
    setQuery(value);
    setIsOpen(value.length > 0);
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md" role="search">
      <label htmlFor="product-search" className="sr-only">Search products</label>
      <div className="relative">
        <input
          ref={inputRef}
          id="product-search"
          type="search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (query) setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products..."
          aria-expanded={isOpen}
          aria-controls="search-results"
          className={`w-full px-10 py-2 text-base border rounded-lg transition-shadow duration-200 focus:outline-none focus:ring-2 ${
            isFocused ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300 hover:border-gray-400'
          } placeholder-gray-500 text-gray-900`}
        />
        <Search 
          className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      
      </div>

      {isOpen && (
        <div 
          ref={resultsRef}
          id="search-results"
          className="absolute mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-full overflow-hidden"
          role="listbox"
          aria-label="Search results"
        >
          {isLoading ? (
            <div className="px-4 py-3 text-gray-600 flex items-center justify-center">
              <div className="animate-spin h-5 w-5 border-b-2 border-blue-500 rounded-full mr-2"></div>
              Loading results...
            </div>
          ) : filteredResults.length > 0 ? (
            <ul className="py-2 overflow-y-auto max-h-96 divide-y divide-gray-100">
              {filteredResults.map((result, index) => (
                <li key={index} className="group">
                  <Link
                    to={`/view-product/${result.productId}`}
                    state={{ 
                      images: result.images.split(",").map((image) => {
                        return `${import.meta.env.VITE_SERVER_URL}${image}`;
                      }), 
                      product: result 
                    }}
                    className="flex items-center px-4 py-3 text-left hover:bg-gray-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 cursor-pointer no-underline text-gray-900 group-hover:bg-gray-50"
                    role="option"
                    aria-selected={false}
                  >
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4">
                      <img 
                        src={`${import.meta.env.VITE_SERVER_URL}${result.images.split(",")[0]}`} 
                        alt="" 
                        className="h-full w-full object-cover" 
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.productName}
                      </p>
                      {result.price && (
                        <p className="mt-1 text-sm text-gray-600">
                          ${parseFloat(result.price).toFixed(2)}
                        </p>
                      )}
                      {result.status && (
                        <p className="mt-1 text-sm text-gray-600">
                          { result.status }
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-gray-500 flex items-center">
              <Info className="h-4 w-4 mr-2 text-gray-400" aria-hidden="true" />
              No products found matching "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;