import { useState, useEffect } from 'react';
import useToast from '../../hooks/useToast';
import useUserAxios from '../../hooks/useUserAxios';
import useSearch from '../../hooks/useSearch';

const HeroCarousel = () => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const axios = useUserAxios();
  const { setToastMessage } = useToast();
  const [categories, setCategories] = useState([]);
  const { products, isLoading } = useSearch();
  console.log(products)
  const getCategories = async () => {
    try {
      const resp = await axios.get("/api/product/viewAll-categories");
      setCategories(resp.data);
    } catch (error) {
      setToastMessage({ message: `${error.message}`, variant: "danger" });
    }
  };
 const filteredProducts=  products?.filter((product) => product.categoryId === categories[currentCategory]?.categoryId).slice(0, 4);

  useEffect(() => {
    if (categories.length === 0) return;

    const timer = setInterval(() => {
      setCurrentCategory((prev) => (prev + 1) % categories.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [categories]);  

 
  useEffect(() => {
    getCategories();
  }, []);

  
  if (categories.length === 0) {
    return <div className="w-full h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="container mx-auto px-6 h-full flex items-center">
          <div className="w-full lg:w-1/2 text-white space-y-6">
            <h3 className="text-2xl font-medium">{categories[currentCategory]?.categoryName}</h3>
            <h2 className="text-5xl font-bold leading-tight">
              {categories[currentCategory]?.description}
            </h2>
            <div className="pt-4 flex space-x-4">
              <button 
                className="group flex items-center bg-red-500 hover:bg-red-600 px-6 py-3 rounded-full text-lg font-medium transition-colors"
                aria-label={`Shop ${categories[currentCategory]?.categoryName || "products"} now`}
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
          
          <div className="hidden lg:block w-1/2">
            <div className="relative w-[500px] h-[500px] mx-auto">
            {filteredProducts.length>0?<div 
                className="absolute inset-0 rounded-md overflow-hidden shadow-2xl transform transition-transform hover:scale-105 duration-500 ease-in-out grid grid-cols-2 grid-rows-2 gap-2 "
                style={{ 
                  boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.3)",
                }}
              >
                {filteredProducts.map((product, index) => {
             
                  return <img
                      src={`${import.meta.env.VITE_SERVER_URL}${product?.images.split(",")[0]}`}
                      alt={`${categories[currentCategory]?.categoryName} category`}
                      className="w-full h-full object-cover"
                      loading="eager"
                      key={index}
                    />
                 
                }) }
              </div>:<img
              src={`${import.meta.env.VITE_SERVER_URL}${categories[currentCategory]?.categoryImage}`}
              alt={`${categories[currentCategory]?.categoryName} category`}
              className="w-full h-full object-cover rounded-md"
              loading="eager"
             
           />}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {categories.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentCategory(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentCategory === index ? 'bg-red-500' : 'bg-yellow-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;