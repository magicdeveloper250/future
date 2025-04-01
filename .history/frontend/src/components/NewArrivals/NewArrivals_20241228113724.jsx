import { useEffect, useState,useRef } from "react";
import ProductCard from "../ProductCard";
import axios from "../../API/axios";
import useToast from "../../hooks/useToast";
import { ChevronLeft, ChevronRight } from "lucide-react";
const CARD_WIDTH = 200;
function NewArrivals() {
  const [products, setProducts] = useState([]);
  const containerRef = useRef();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hideRight, setHideRight] = useState(false);
  const { setToastMessage } = useToast();
  const getProducts = async () => {
    try {
      const resp = await axios.get("/api/product/viewAll-product");
      setProducts(resp.data);
    } catch (error) {
      setToastMessage({
        variant: "danger",
        message: "Failed to fetch data"
      });
    }
  };
  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -CARD_WIDTH : CARD_WIDTH;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const updateScroll = () => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      setScrollPosition(container.scrollLeft);
      setHideRight(container.scrollLeft >= maxScrollLeft - 1);
    };

    container.addEventListener("scroll", updateScroll);
    return () => container.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <div className="w-full px-4 py-8">
      <div className="flex flex-wrap gap-1 items-center justify-between mb-6">
        {/* <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" className="animate-wave-slow">
            <pattern
              id="diagonalLines"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="10"
                stroke="#475569"
                strokeWidth="1"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#diagonalLines)" />
          </svg>
        </div> */}

        {/* <div className="absolute bottom-0 left-0 w-full animate-wave">
          <svg
            viewBox="0 0 1440 320"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              fill="#e2e8f0"
              d="M0,128L60,154.7C120,181,240,235,360,234.7C480,235,600,181,720,181.3C840,181,960,235,1080,245.3C1200,256,1320,224,1380,208L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            />
          </svg>
        </div> */}

        {/* <div className="absolute bottom-0 left-0 w-full animate-wave-slower">
          <svg
            viewBox="0 0 1440 320"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              fill="#cbd5e1"
              d="M0,256L60,245.3C120,235,240,213,360,202.7C480,192,600,192,720,197.3C840,203,960,213,1080,197.3C1200,181,1320,139,1380,117.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            />
          </svg>
        </div> */}

        {/* <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <pattern
              id="dots"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="10" cy="10" r="1.5" fill="#334155" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div> */}
      </div>

      <div className="relative z-10 w-full flex flex-col my-4 justify-center">
      <h5 className="ml-10 text-xl font-semibold text-slate-800">
            New Arrivals
          </h5>
        
         
          <div className="relative">
          <button
          onClick={() => scroll('left')}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-opacity ${
            scrollPosition > 0 ? "opacity-100" : "opacity-0"
          }`}
          disabled={scrollPosition <= 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div
          ref={containerRef}
          className="flex gap-1 overflow-x-auto scroll-smooth no-scrollbar"
          style={{
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
          }}
        >

            {products.length > 0 ? (
              products?.map((product) => (
                <div
                key={product.productId}
                className={`flex-none w-[${CARD_WIDTH}px] scroll-snap-align-start`}
              >
                <ProductCard product={product} key={product.name} />
                </div>
              ))
            ) : (
              <p className="netflix-no-content">No Product found.</p>
            )}
          </div>
            <button
          onClick={() => scroll('right')}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-opacity ${
            !hideRight ? "opacity-100" : "opacity-0"
          }`}
          disabled={hideRight}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
          </div>
      
      </div>
    </div>
  );
}

export default NewArrivals;