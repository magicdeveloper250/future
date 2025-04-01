import React, { useState } from 'react';
import {   ArrowLeft } from 'lucide-react';
import {   useNavigate, useParams } from 'react-router';
import axios from '../API/axios';

const CategoryPage = () => {
  const navigate = useNavigate();
  const[product, setProducts]= useState([]);
  const categoryId= useParams().id;
  const categoryName= useState("")

 
  const getProducts = async () => {
    try {
      const resp = await axios.get(`/api/product?category=${categoryId}`);
      setProducts(resp.data);
    } catch (error) {
      setToastMessage({
        variant: "danger",
        message: "Failed to fetch data"
      });
    }
  };
 
  return (
    <div className="container mx-auto px-4 py-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      
      <div className="w-full px-4 py-8">
     

     <div className="relative z-10 w-full flex flex-col my-4 justify-center">
     <h5 className="ml-10 text-xl font-semibold text-slate-800">
            {categoryName}
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
    </div>
  );
};

export default CategoryPage;