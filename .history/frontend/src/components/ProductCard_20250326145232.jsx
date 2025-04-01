import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const images = product.images.split(",").map((image) => {
      return `${import.meta.env.VITE_SERVER_URL}${image}`;
    });
    setImages(images);
  }, [product]);

 
 

  return (
    <div className="relative w-64 bg-white rounded-lg overflow-hidden">
      <div className="aspect-square bg-white p-4">
        <img
          src={images[0]}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="p-4">
        
        <div className="flex flex-col gap-2 mt-1">
          <span>{product.name}</span>

        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-bold">{String(new Intl.NumberFormat('US-en', { style: 'currency', currency: 'RWF' }).format(product.price))}</span>
          {product.originalPrice && (
            <span className="text-gray-500 line-through text-sm">
              ${product.originalPrice}
            </span>
          )}
        </div>

         

        <Link
          to={`/view-product/${product.productId}`}
          state={{ images: images, product: product }}
          className="absolute bottom-4 right-4 p-2 bg-red-500 rounded-lg hover:bg-sky-500 transition-colors "
        >
          <ShoppingCart className="w-5 h-5 text-black" />
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;