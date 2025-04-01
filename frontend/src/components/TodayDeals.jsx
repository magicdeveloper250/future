import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "../API/axios";
function TodayDeals() {
 const[products, setProducts]= useState([])
   const getProducts= async()=>{
     try { 
         const resp= await axios.get("/api/product/today-deals")
         setProducts(resp.data)
         
     } catch (error) {
         
     }
   }
   useEffect(()=>{
    getProducts()
   },[])
  return <div className="w-full flex flex-col my-4 justify-center">
     
    <div className="w-full flex   gap-2 flex-col my-4">
                <h5 className="ml-10">Today's Deals</h5>
                <div
            className="arrivals-container"
            >
            {products.length>0?products?.map((product, index) => (
                <ProductCard
                product={product}
                key={product.name}
                />
            )):<p className="netflix-no-content">No Product found.</p>}
            </div> 
  </div>
  </div>
   
}

export default TodayDeals;