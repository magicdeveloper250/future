 

import { useState } from 'react';
import { Heart, Eye } from 'lucide-react';
import { useEffect } from 'react';

const CategoryCard = (category) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
   const[images, setImages]= useState([])
  useEffect(()=>{
    const images = category.images?.split(",").map((image, index) => {
      return `${import.meta.env.VITE_SERVER_URL}/uploads/${image}`
    })
    setImages( images)
},[category])

   

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div 
      className="relative w-60 rounded-lg bg-gray-900 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount badge */}
      <div className="absolute top-2 left-2 z-10">
        <span className="bg-black text-white px-2 py-1 rounded-full text-sm">
          -{0}%
        </span>
      </div>

      {/* Action buttons */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
        <button className="p-2 bg-white rounded-full hover:bg-gray-100">
          <Heart className="w-4 h-4" />
        </button>
        <button className="p-2 bg-white rounded-full hover:bg-gray-100">
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Image container */}
      <div className="relative aspect-square" onClick={nextImage}>
        <img
          src={images&&images[currentImageIndex]}
          alt={category.name}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      </div>

      {/* Product info and Add to Cart */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-white font-bold">${category.price}</span>
          <span className="text-gray-400 line-through text-sm">
            ${category.price}
          </span>
        </div>

        {/* Add to Cart button */}
        <div className={`mt-3 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button className="w-full py-2 bg-green-400 text-black font-semibold rounded-md hover:bg-green-500 transition-colors">
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
