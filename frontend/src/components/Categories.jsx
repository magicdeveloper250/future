import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, Download, ChevronDown, Eye, Edit, Trash2 } from 'lucide-react';
import Modal from 'react-bootstrap/Modal';
import useUserAxios from '../hooks/useUserAxios';
import useToast from '../hooks/useToast';

const Categories = () => {
  const axios = useUserAxios();
  const { setToastMessage } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewCategory, setViewCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    categoryName: '',
    categoryDescription: '',
    categoryImage: ''
  });

  const [filters, setFilters] = useState({
    productCount: '',
    dateCreated: ''
  });

  const filterRef = useRef(null);

  const handleClose = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };

  const handleViewClose = () => {
    setShowViewModal(false);
    setViewCategory(null);
  };

  const handleShow = () => setShowModal(true);
  
  const handleView = (category) => {
    setViewCategory(category);
    setShowViewModal(true);
  };

  const filteredCategories = useMemo(() => {
    return categories?.filter((category) => {
      return category.categoryName.toLowerCase().includes(query.toLowerCase());
    });
  }, [categories, query]);
 

  const getCategories = async () => {
    try {
      const resp = await axios.get("/api/product/viewAll-categories");
      setCategories(resp.data);
    } catch (error) {
      setToastMessage({
        variant: "danger",
        message: error.message,
      } )
    }
  };


  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      productCount: '',
      dateCreated: ''
    });
  };

  const applyFilters = () => {
    setShowFilter(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('categoryName', categoryForm.categoryName);
      formData.append('categoryDescription', categoryForm.categoryDescription); 
      formData.append('categoryImage', categoryForm.categoryImage);
      const resp= await axios.post("/api/product/create-category", formData, {headers:{
        "Content-Type": 'multipart/form-data'
      }})
      handleClose()
      await getCategories()
      setToastMessage({
        variant: "success",
        message: resp.data.message,
      } )
      setSelectedcategory({})
      
    } catch (error) {
        if(error.response){
          console.log(error)
          setToastMessage({
            variant: "danger",
            message: error.response.data.message,
          } )
        }else{
          setToastMessage({
            variant: "danger",
            message: String(error),
          } )
        }
      
    }
  };


  
  const handleEditCategory = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('categoryName', categoryForm.categoryName);
      formData.append('categoryDescription', categoryForm.categoryDescription); 
      formData.append('categoryImage', categoryForm.categoryImage);
      const resp= await axios.put(`/api/product/update-category/${selectedCategory.categoryId}`, formData, {headers:{
        "Content-Type": 'multipart/form-data'
      }})
      handleClose()
      await getCategories()
      setToastMessage({
        variant: "success",
        message: resp.data.message,
      } )
      
    } catch (error) {
        if(error.response){
          console.log(error)
          setToastMessage({
            variant: "danger",
            message: error.response.data.message,
          } )
        }else{
          setToastMessage({
            variant: "danger",
            message: String(error),
          } )
        }
      
    }
  };

  const handleDeleteCategory = async (e,categoryId ) => {
    e.preventDefault();
    try {
      const resp= await axios.delete(`/api/product/delete-category/${categoryId}`, {headers:{
        "Content-Type": 'multipart/form-data'
      }})
      handleClose()
      await getCategories()
      setToastMessage({
        variant: "success",
        message: resp.data.message,
      } )
      
    } catch (error) {
        if(error.response){
          console.log(error)
          setToastMessage({
            variant: "danger",
            message: error.response.data.message,
          } )
        }else{
          setToastMessage({
            variant: "danger",
            message: String(error),
          } )
        }
      
    }
  };


  useEffect(() => {
    getCategories();
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



  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search categories..."
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
            Add Category
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
                    <label className="text-sm font-medium text-gray-700">Product Count</label>
                    <select
                      value={filters.productCount}
                      onChange={(e) => handleFilterChange('productCount', e.target.value)}
                      className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All</option>
                      <option value="0">No Products</option>
                      <option value="1-10">1-10 Products</option>
                      <option value="11-50">11-50 Products</option>
                      <option value="50+">50+ Products</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Date Created</label>
                    <select
                      value={filters.dateCreated}
                      onChange={(e) => handleFilterChange('dateCreated', e.target.value)}
                      className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products Count
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCategories.map((category) => (
              <tr key={category.categoryId}>
                <td className="px-6 py-4 whitespace-nowrap">{category.categoryName}</td>
                <td className="px-6 py-4">{category.categoryCount || 0}</td>
                <td className="px-6 py-4">{category.description}</td>
                <td className="px-6 py-4">
                  <img 
                    src={import.meta.env.VITE_SERVER_URL + category.categoryImage} 
                    alt={category.categoryName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleView(category)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedCategory(category);
                        setCategoryForm({
                          categoryName: category.categoryName,
                          categoryDescription: category.description,
                          categoryImage: ""
                        });
                        handleShow();
                      }}
                      className="text-yellow-600 hover:text-yellow-800 transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteCategory(e, category.categoryId)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showViewModal} onHide={handleViewClose}>
        <Modal.Header closeButton>
          <Modal.Title>Category Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewCategory && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img 
                  src={import.meta.env.VITE_SERVER_URL + viewCategory.categoryImage}
                  alt={viewCategory.categoryName}
                  className="w-32 h-32 rounded-lg object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{viewCategory.categoryName}</h3>
                <p className="text-gray-600 mt-1">{viewCategory.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Products Count</label>
                  <p className="mt-1">{viewCategory.categoryCount || 0}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Created At</label>
                  <p className="mt-1">{new Date(viewCategory.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button 
            onClick={handleViewClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title> {selectedCategory?"Update Category":"Create New Category"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={selectedCategory?handleEditCategory:handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category Name</label>
              <input
              name='categoryName'
                type="text"
                value={categoryForm.categoryName}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, categoryName: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name='categoryDescription'
                value={categoryForm.categoryDescription}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, categoryDescription: e.target.value }))}
                rows={3}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                name='categoryImage'
                onChange={(e) => setCategoryForm(prev => ({ ...prev, categoryImage: e.target.files[0] }))}
                type='file'
                required={selectedCategory==null}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                {selectedCategory?"Save":"Create Category"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Categories;