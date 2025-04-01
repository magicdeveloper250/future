import React, { useEffect, useState } from 'react';
import {   ArrowLeft } from 'lucide-react';
import {   useLocation, useNavigate, useParams } from 'react-router';
import axios from '../API/axios';
import ProductCard from '../components/ProductCard';
const CategoryPage = () => {
  const navigate = useNavigate();
  const[products, setProducts]= useState([]);
  const categoryId= useParams().id;
  const currentCategory= useLocation().state.category;
  

 
  const getProducts = async () => {
    try {
      const resp = await axios.get(`/api/product/view-category/${categoryId}/products`);
      console.log(resp.data)
      setProducts(resp.data.products);
    } catch (error) {
      setToastMessage({
        variant: "danger",
        message: "Failed to fetch data"
      });
    }
  };
 useEffect(()=>{
    getProducts()
 },[])
  return (
    <div className="container mx-auto px-4 py-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      
    
       <div
      
         className={`grid md:grid-cols-2  gap-8`}
        
       >

           {products.length > 0 ? (
             products?.map((product) => (
               <div
               key={product.productId}
               className={`flex-none w-[200px] scroll-snap-align-start`}
             >
               <ProductCard product={product} key={product.name} />
               </div>
             ))
           ) : (
             <p className="netflix-no-content">No Product found.</p>
           )}
         </div>
        
     
     </div>
   
  );
};

export default CategoryPage;