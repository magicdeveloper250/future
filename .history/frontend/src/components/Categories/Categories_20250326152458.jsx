import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "../../API/axios";
import ProductCard from "../ProductCard";
import { Link } from "react-router";
import useToast from "../../hooks/useToast";
const CARD_WIDTH = 200;

const Categories = () => {
  const { setToastMessage } = useToast();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const containerRef = useRef();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hideRight, setHideRight] = useState(false);
  const MAX_PRODUCTS=1

  const filteredProducts = useMemo(() => {
    return products?.filter((product) => 
      selectedFilter === "All" || categories.find(category=>category?.categoryId==product?.categoryId)?.categoryName === selectedFilter
    ).slice(0, MAX_PRODUCTS);
  }, [products, selectedFilter]);

  const categoryTypes = useMemo(() => {
    const types = new Set(categories.map(category => category.categoryName));
    return ["All", ...Array.from(types)];
  }, [categories]);

  const getProductsCategories = async () => {
    try {
      const [productsResp, categoriesResp] = await Promise.all([
        axios.get("/api/product/viewAll-product"),
        axios.get("/api/product/viewAll-categories")
      ]);
      setProducts(productsResp.data);
      setCategories(categoriesResp.data);
    } catch (error) {
      setToastMessage({
        variant: "danger",
        message: "Failed to fetch data"
      });
    }
  };
  console.log(filteredProducts.length)

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -CARD_WIDTH : CARD_WIDTH;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    getProductsCategories();
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
        <div className="flex flex-wrap gap-2">
          {categoryTypes.map((type) => (
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
          ))}
        </div>
      </div>

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
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.productId}
                className={`flex-none w-[${CARD_WIDTH}px] scroll-snap-align-start`}
              >
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center w-full py-8">
              No products found.
            </p>
          )}
        </div>

        {products.length>MAX_PRODUCTS &selectedFilter !=="All"?<Link
          to={`/category/${filteredProducts[0]?.categoryId}`}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md no-underline  hover:bg-gray-100 transition-opacity ${
            !hideRight ? "opacity-100" : "opacity-0"
          }`}
          state={{category:{categoryName: selectedFilter}}}
          disabled={hideRight}
        >
          View More
        </Link>:<button
          onClick={() => scroll('right')}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-opacity ${
            !hideRight ? "opacity-100" : "opacity-0"
          }`}
          disabled={hideRight}
        >
          <ChevronRight className="w-6 h-6" />
        </button>}
      </div>
    </div>
  );
};

export default Categories;