import { useState, useEffect } from 'react';
import useToast from '../../hooks/useToast';
import useUserAxios from '../../hooks/useUserAxios';

const HeroCarousel = () => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const axios = useUserAxios();
  const { setToastMessage } = useToast();
  const [categories, setCategories] = useState([]);
  
  const getCategories = async () => {
    setIsLoading(true);
    try {
      const resp = await axios.get("/api/product/viewAll-categories");
      setCategories(resp.data);
    } catch (error) {
      setToastMessage({ 
        message: `Failed to load categories: ${error.message}`, 
        variant: "danger" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;

    const timer = setInterval(() => {
      setCurrentCategory((prev) => (prev + 1) % categories.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [categories]);

  const handleCategoryChange = (index) => {
    setCurrentCategory(index);
  };

  const handleKeyNavigation = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleCategoryChange(index);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-slate-900 flex items-center justify-center text-white" aria-live="polite">
        <div className="animate-pulse">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
          </svg>
          <span className="sr-only">Loading categories...</span>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="w-full h-screen bg-slate-900 flex items-center justify-center text-white">
        <p>No categories available</p>
      </div>
    );
  }

  const currentCategoryData = categories[currentCategory];

  return (
    <section 
      className="relative w-full h-screen bg-slate-900 overflow-hidden" 
      aria-roledescription="carousel"
      aria-label="Product Categories"
    >
      <div className="absolute inset-0">
        <div className="container mx-auto px-6 h-full flex flex-col md:flex-row items-center">
          {/* Text Content - Left Side */}
          <div className="w-full md:w-1/2 text-white space-y-6 z-10">
            <span className="inline-block px-4 py-1 bg-red-500 rounded-full text-sm font-medium mb-2">
              Featured
            </span>
            <h2 className="text-2xl font-medium">
              {currentCategoryData?.categoryName || "Category"}
            </h2>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {currentCategoryData?.description || "Loading description..."}
            </h1>
            <p className="text-gray-300 max-w-md">
              Discover our extensive collection of premium {currentCategoryData?.categoryName?.toLowerCase() || "products"} 
              designed with quality and style in mind.
            </p>
            <div className="pt-4 flex space-x-4">
              <button 
                className="group flex items-center bg-red-500 hover:bg-red-600 px-6 py-3 rounded-full text-lg font-medium transition-colors"
                aria-label={`Shop ${currentCategoryData?.categoryName || "products"} now`}
              >
                <span>Shop Now</span>
                <svg 
                  className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" 
                  />
                </svg>
              </button>
              <button 
                className="border border-white hover:border-red-500 hover:text-red-500 px-6 py-3 rounded-full text-lg font-medium transition-colors"
                aria-label="View details"
              >
                Learn More
              </button>
            </div>
          </div>
          
          {/* Image Content - Right Side */}
          <div className="relative w-full md:w-1/2 mt-8 md:mt-0">
            <div className="relative w-full md:w-96 h-96 mx-auto">
              {/* Decorative background elements */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500 rounded-full opacity-10 filter blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-300 rounded-full opacity-10 filter blur-xl"></div>
              
              {/* Main image container */}
              <div 
                className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl transform transition-transform hover:scale-105 duration-500 ease-in-out"
                style={{ 
                  boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.3)",
                }}
              >
                {currentCategoryData?.categoryImage ? (
                  <img
                    src={`${import.meta.env.VITE_SERVER_URL}${currentCategoryData.categoryImage}`}
                    alt={`${currentCategoryData.categoryName} category`}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <p className="text-gray-400">Image not available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category navigation/indicators */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3"
        role="tablist"
        aria-label="Category navigation"
      >
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => handleCategoryChange(index)}
            onKeyDown={(e) => handleKeyNavigation(e, index)}
            className={`w-3 h-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
              currentCategory === index 
                ? 'bg-red-500 scale-125' 
                : 'bg-gray-400 hover:bg-gray-300'
            }`}
            role="tab"
            aria-selected={currentCategory === index}
            aria-label={`View ${category.categoryName}`}
            tabIndex={0}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;