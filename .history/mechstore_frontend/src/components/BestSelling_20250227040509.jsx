import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "../API/axios";
import { Link } from "react-router";

function BestSelling() {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const resp = await axios.get("/api/product/best-selling");
      setProducts(resp.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="relative h-full w-full">
          <div className="absolute w-full h-full opacity-30 animate-wave">
            <svg 
              viewBox="0 0 1440 320" 
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <path 
                fill="#0EA5E9"
                fillOpacity="0.5"
                d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,80C960,64,1056,96,1152,112C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
            </svg>
          </div>
          
          <div className="absolute w-full h-full opacity-50 animate-wave-slow">
            <svg 
              viewBox="0 0 1440 320" 
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <path 
                fill="#475569"
                fillOpacity="0.5"
                d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,186.7C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
            </svg>
          </div>
          
          <div className="absolute w-full h-full opacity-70 animate-wave-slower">
            <svg 
              viewBox="0 0 1440 320" 
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <path 
                fill="#334155"
                fillOpacity="0.5"
                d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,144C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full flex flex-col my-4 justify-center">
       
        <div className="w-full flex gap-2 flex-col my-4">
          <h5 className="ml-10 text-slate-800 font-semibold text-xl">Best Selling</h5>
          <div className="arrivals-container">
            {products.length > 0 ? (
              products?.map((product) => (
                <ProductCard
                  product={product}
                  key={product.name}
                />
              ))
            ) : (
              <p className="netflix-no-content">No Product found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BestSelling;