import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import useSearch from '../hooks/useSearch';
import { Link } from 'react-router';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { products } = useSearch();
  const wrapperRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredResults = products.filter(product =>
    product?.productName.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = (value) => {
    setQuery(value);
    setIsOpen(true);
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search..."
          className="w-full px-6 py-2 pl-10 pr-10 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search 
          className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && query && (
        <div 
          ref={resultsRef}
          className="absolute mt-1 bg-white rounded-lg shadow-lg border z-50 overflow-hidden"
          style={{ 
            width: 'max-content',
            minWidth: '100%',
            maxWidth: '150%',
            maxHeight: '60vh'
          }}
        >
          {filteredResults.length > 0 ? (
            <ul className="py-2 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {filteredResults.map((result, index) => (
                <li key={index} className="px-2">
                  <Link
                    to={`/view-product/${result.productId}`}
                    state={{ 
                      images: result.images.split(",").map((image) => {
                        return `${import.meta.env.VITE_SERVER_URL}${image}`;
                      }), 
                      product: result 
                    }}
                    className="block w-full px-4 py-2 text-left rounded hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 cursor-pointer no-underline text-gray-900 truncate"
                  >
                   <img src={ `${import.meta.env.VITE_SERVER_URL}${result.images.split(",")[0]}`} alt="" /> {result.productName}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-2 text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;