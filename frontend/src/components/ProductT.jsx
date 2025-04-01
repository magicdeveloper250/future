import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { Link } from 'react-router';

const ProductT = ({ products, onCreateClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'productName',
    direction: 'ascending'
  });

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: 
        sortConfig.key === key && sortConfig.direction === 'ascending' 
          ? 'descending' 
          : 'ascending'
    });
  };

  // Sort and filter the products
  const filteredProducts = useMemo(() => {
    let filtered = [...(products || [])];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        Object.values(product).some(value =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [products, searchTerm, sortConfig]);

  // Header component with sort functionality
  const TableHeader = ({ label, field }) => (
    <th 
      className="px-6 py-3 bg-gray-50 text-left cursor-pointer hover:bg-gray-100"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm text-gray-700">{label}</span>
        <div className="flex flex-col">
          <ChevronUp 
            className={`w-4 h-4 ${
              sortConfig.key === field && sortConfig.direction === 'ascending'
                ? 'text-blue-600'
                : 'text-gray-400'
            }`}
          />
          <ChevronDown 
            className={`w-4 h-4 -mt-2 ${
              sortConfig.key === field && sortConfig.direction === 'descending'
                ? 'text-blue-600'
                : 'text-gray-400'
            }`}
          />
        </div>
      </div>
    </th>
  );

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
        {/* Search Bar */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Create Product Button */}
        <div className=' border-gray-800 rounded-md'>
        <Link to="/create-product"
          onClick={onCreateClick}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium ml-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Create Product</span>
        </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <TableHeader label="Product Name" field="productName" />
                <TableHeader label="Category" field="category" />
                <TableHeader label="Type/Model" field="type_model" />
                <TableHeader label="Vehicle Compatible" field="vehicleCompatible" />
                <TableHeader label="Size" field="size" />
                <th className="px-6 py-3 bg-gray-50">
                  <span className="font-semibold text-sm text-gray-700">Image</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product, index) => (
                <tr 
                  key={index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.type_model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.vehicleCompatible}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.images && (
                      <img
                        src="/api/placeholder/40/40"
                        alt={product.productName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    )}
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td 
                    colSpan="6" 
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductT;