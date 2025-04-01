import { Plus, Search, Filter, Download, ChevronDown } from 'lucide-react';
import CreateProductForm from "./CreateProductForm";
import { useState, useRef, useEffect, useMemo } from 'react';
import Modal from 'react-bootstrap/Modal';
import ProductTable from './ProductTable';
import useUserAxios from '../hooks/useUserAxios';
import useToast from '../hooks/useToast';

const Products = () => {
  const axios= useUserAxios()
  const [showModal, setShowModal] = useState(false);
  const { setToastMessage } = useToast();
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const[categories, setCategories]=useState([])
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    price: '',
    stock: ''
  });
  
  const filterRef = useRef(null);
  
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

   const filterProducts = useMemo(() => {
     return products?.filter((product) => {
       const matchesSearch = product.productName.toLowerCase().includes(query.toLowerCase());
       return matchesSearch;
     });
   }, [products, query]);
 
const  handleAddProduct=async(productData)=>{
  try {
    const resp= await axios.post("/api/product/create-product",productData, {
      headers:{
          "Content-Type": 'multipart/form-data'
      }
    })
    setToastMessage({
      variant: "success",
      message: resp.data.message,
    });
    await getProducts()
    handleClose()
  } catch (error) {
    setToastMessage({
      variant: "danger",
      message: error.message,
    } );
    
  }
}
const getProducts = async () => {
     try {
       const resp = await axios.get("/api/product/viewAll-product");
       setProducts(resp.data);
     } catch (error) {
       setToastMessage({message:`${error.message}`,variant:"danger"} );
     }
   };
 
   
  const getCategories = async () => {
       try {
         const resp = await axios.get("/api/product/viewAll-categories");
         setCategories(resp.data);
       } catch (error) {
         setToastMessage({message:`${error.message}`,variant:"danger"} )
       }
     };
   
     
 
   useEffect(() => {
    Promise.all([getProducts(),getCategories()])
    
   }, []);
 
    
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      status: '',
      price: '',
      stock: ''
    });
  };

  const applyFilters = () => {
    console.log('Applied filters:', filters);
    setShowFilter(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleShow}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
          
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                Object.values(filters).some(v => v) 
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              <ChevronDown className="w-4 h-4" />
            </button>

            {showFilter && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border p-4 z-50">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Categories</option>
                     
                      {categories.map((category, index)=>{
                        return <option key={index} value={category.categoryName}>{category.categoryName}</option>

                      })}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Price Range</label>
                    <select
                      value={filters.price}
                      onChange={(e) => handleFilterChange('price', e.target.value)}
                      className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Prices</option>
                      <option value="0-50">$0 - $50</option>
                      <option value="51-100">$51 - $100</option>
                      <option value="101-200">$101 - $200</option>
                      <option value="201+">$201+</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Stock Level</label>
                    <select
                      value={filters.stock}
                      onChange={(e) => handleFilterChange('stock', e.target.value)}
                      className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Stock Levels</option>
                      <option value="out">Out of Stock</option>
                      <option value="low">Low Stock (1-10)</option>
                      <option value="medium">Medium Stock (11-50)</option>
                      <option value="high">High Stock (50+)</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <button
                      onClick={clearFilters}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Clear
                    </button>
                    <button
                      onClick={applyFilters}
                      className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateProductForm onAddProduct={handleAddProduct} onSuccess={handleClose}  categories={categories}/>
        </Modal.Body>
      </Modal>

      <ProductTable products={filterProducts} categories= {categories} getProducts={getProducts}/>
    </div>
  );
};

export default Products;