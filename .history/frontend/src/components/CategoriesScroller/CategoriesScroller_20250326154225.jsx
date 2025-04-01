import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "../../API/axios";
import ProductCard from "../ProductCard";
import { Link } from "react-router";
import useToast from "../../hooks/useToast";
const CARD_WIDTH = 200;

const CategoriesScroller = ({categories=[], onSelectCategory}) => {
 
  const [selectedFilter, setSelectedFilter] = useState("All");
  const containerRef = useRef();
 
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hideRight, setHideRight] = useState(false);
 
 
 

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -CARD_WIDTH : CARD_WIDTH;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

 

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
useEffect(()=>{
    onSelectCategory(selectedFilter)
},[selectedFilter])
  return (
    <div className="w-full px-4 py-8">
      
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
          {categories.length > 0 ? (
             categories.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedFilter(type)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedFilter === type
                    ? "bg-primary text-black"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                {type}
              </button>
            ))
          ) : (
            <p className="text-gray-500 text-center w-full py-8">
              No categories found.
            </p>
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
     
  );
};

export default CategoriesScroller;