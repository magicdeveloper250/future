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