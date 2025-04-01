import { useState } from 'react';
import { Star, StarHalf, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const products = [
    {
      id: 1,
      name: 'Toyota Camry Brake Pads',
      price: 89999,
      rating: 4.5,
      reviews: 128,
      image: '/api/placeholder/200/200',
      category: 'Brake System',
      condition: 'New'
    },
  ];

  const filters = {
    categories: ['Engine Parts', 'Brake System', 'Suspension', 'Electronics'],
    conditions: ['New', 'Used', 'Refurbished'],
    priceRanges: ['Under 50k', '50k-100k', '100k-200k', 'Over 200k']
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
      
        <div className="flex-1">

          <div className="flex items-center justify-between mb-6">
            <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
            <div className="text-sm text-gray-500">
              Showing {products.length} results
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded p-1"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <div 
                key={product.id}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-contain mb-4"
                />
                <h3 className="font-medium mb-2">{product.name}</h3>
                <div className="flex items-center mb-2">
                  {Array(Math.floor(product.rating)).fill().map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                  ))}
                  {product.rating % 1 !== 0 && (
                    <StarHalf className="w-4 h-4 fill-current text-yellow-400" />
                  )}
                  <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                </div>
                <div className="text-lg font-bold">
                  {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'RWF' }).format(product.price)}
                </div>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">{product.category}</span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">{product.condition}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;