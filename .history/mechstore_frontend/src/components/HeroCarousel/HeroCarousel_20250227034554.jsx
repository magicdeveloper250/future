import { useState, useEffect } from 'react';
import useToast from '../../hooks/useToast';
import useUserAxios from '../../hooks/useUserAxios';
import useSearch from '../../hooks/useSearch';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';

const HeroCarousel = () => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
  const axios = useUserAxios();
  const { setToastMessage } = useToast();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { products } = useSearch();
  
  const getCategories = async () => {
    setIsLoading(true);
    try {
      const resp = await axios.get("/api/product/viewAll-categories");
      setCategories(resp.data);
    } catch (error) {
      setToastMessage({ message: `${error.message}`, variant: "danger" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredProducts = products?.filter(
    (product) => product.categoryId === categories[currentCategory]?.categoryId
  ).slice(0, 4);

  useEffect(() => {
    if (categories.length === 0 || !isAutoPlayEnabled) return;

    const timer = setInterval(() => {
      setCurrentCategory((prev) => (prev + 1) % categories.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [categories, isAutoPlayEnabled]);  

  useEffect(() => {
    getCategories();
  }, []);

  const nextSlide = () => {
    setCurrentCategory((prev) => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    setCurrentCategory((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const pauseAutoPlay = () => {
    setIsAutoPlayEnabled(false);
  };

  const resumeAutoPlay = () => {
    setIsAutoPlayEnabled(true);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-l-2 border-red-500 rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="w-full h-screen bg-slate-900 flex items-center justify-center text-white">
        <p className="text-xl">No categories found. Check back later.</p>
      </div>
    );
  }

  return (
    <section 
      className="relative w-full h-screen bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden"
      aria-label="Featured product categories"
    >
      <div className="absolute inset-0">
        <div className="container mx-auto px-6 h-full flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-2/5 text-white space-y-6 z-10 mb-8 lg:mb-0">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="font-medium text-red-300 uppercase">
                  {categories[currentCategory]?.categoryName}
                </h1>
                <p className="text-lg md:text-md font-bold leading-tight mt-[0.5px] text-slate-200 px-2 italic">
                  {categories[currentCategory]?.description}
                </p>
              </motion.div>
            </AnimatePresence>
            
            <div className="pt-6 flex flex-wrap gap-4">
              <button 
                className="group flex items-center bg-primary hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-900 px-6 py-3 rounded-full text-lg font-medium transition duration-300 ease-in-out"
                aria-label={`Shop ${categories[currentCategory]?.categoryName || "products"} now`}
              >
                <span>Shop Now</span>
                <svg 
                  className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" 
                  />
                </svg>
              </button>
              <Link 
                to={`/category/${categories[currentCategory]?.categoryId}`}
                className="border border-white hover:border-red-500 hover:text-red-500 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 px-6 py-3 rounded-full text-lg font-medium transition duration-300 ease-in-out no-underline"
                aria-label={`View all products in ${categories[currentCategory]?.categoryName}`}
              >
                Explore Collection
              </Link>
            </div>
            
            <div className="pt-8 flex space-x-4 items-center">
              <button 
                onClick={prevSlide}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Previous category"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex-1 flex justify-center">
                {categories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCategory(index)}
                    className={`w-2.5 h-2.5 mx-1 rounded-full transition-all duration-300 ${
                      currentCategory === index 
                        ? 'bg-red-500 w-6' 
                        : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                    aria-label={`Go to category ${index + 1} of ${categories.length}`}
                    aria-current={currentCategory === index ? 'true' : 'false'}
                  />
                ))}
              </div>
              <button 
                onClick={nextSlide}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Next category"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button 
                onClick={isAutoPlayEnabled ? pauseAutoPlay : resumeAutoPlay}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label={isAutoPlayEnabled ? "Pause slideshow" : "Play slideshow"}
              >
                {isAutoPlayEnabled ? (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="relative w-[500px] lg:w-3/5 h-[400px] lg:h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCategory}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="h-full w-full"
                onMouseEnter={pauseAutoPlay}
                onMouseLeave={resumeAutoPlay}
                onFocus={pauseAutoPlay}
                onBlur={resumeAutoPlay}
              >
                {filteredProducts && filteredProducts.length > 0 ? (
                  <div 
                    className={`relative w-[500px] h-[500px] mx-auto ${
                      filteredProducts.length === 1 ? 'grid-cols-1' : 
                      filteredProducts.length === 2 ? 'grid grid-cols-2' : 
                      filteredProducts.length === 3 ? 'grid grid-cols-3' : 
                      'grid grid-cols-2 grid-rows-2'
                    } gap-1`}
                    style={{ 
                      boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {filteredProducts.map((product, index) => {
                      const imageUrl = `${import.meta.env.VITE_SERVER_URL}${product?.images.split(",")[0]}`;
                      return (
                        <Link
                          key={product.productId}
                          to={`/view-product/${product.productId}`}
                          state={{ 
                            images: product.images.split(",").map((image) => {
                              return `${import.meta.env.VITE_SERVER_URL}${image}`;
                            }), 
                            product: product
                          }}
                          className="relative group block h-full overflow-hidden"
                          aria-label={`View ${product.name || 'product'} details`}
                        >
                          <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white bg-opacity-90 rounded-full px-4 py-2 text-sm font-medium text-slate-900">
                              View Product
                            </div>
                          </div>
                          <img
                            src={imageUrl}
                            alt={product.name || `Product in ${categories[currentCategory]?.categoryName} category`}
                            className="w-full h-[450px] rounded-md p-1 object-cover transition-transform duration-500 group-hover:scale-110"
                            loading={index === 0 ? "eager" : "lazy"}
                          />
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="w-full h-h-[450px] rounded-lg overflow-hidden shadow-2xl relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60 z-10"></div>
                    <img
                      src={`${import.meta.env.VITE_SERVER_URL}${categories[currentCategory]?.categoryImage}`}
                      alt={`${categories[currentCategory]?.categoryName} category`}
                      className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-105 rounded-md"
                      loading="eager"
                    />
                    <div className="absolute bottom-6 left-6 right-6 z-20">
                      <p className="text-white text-xl font-medium">{categories[currentCategory]?.categoryName}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </section>
  );
};

export default HeroCarousel;