import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Edit,Pencil, Trash2, Eye , AlertTriangle} from 'lucide-react';
import useToast from '../hooks/useToast';
import useUserAxios from '../hooks/useUserAxios';

const ProductTable = ({ products, categories, getProducts}) => {
  const axios= useUserAxios()
  const { setToastMessage } = useToast()
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    categoryId: "",
    type_model: "",
    vehicleCompatible: "",
    size: "",
    images: "",
    description: "",
    price: "",
    warrantyPeriod: "",
    conditions: "",
    status: "instock",
    dateAdded: new Date().toISOString(),
  });


  const [imagePreview, setImagePreview] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "images") {
      const fileArray = Array.from(files);
      setFormData({
        ...formData,
        images: fileArray
      });

      const previewUrls = fileArray.map(file => URL.createObjectURL(file));
      setImagePreview(previewUrls);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = new FormData();
    productData.append("productName", formData.productName);
    productData.append("category", formData.categoryId);
    productData.append("model", formData.type_model);
    productData.append("vehicle", formData.vehicleCompatible);
    productData.append("size", formData.size);
    productData.append("description", formData.description);
    productData.append("price", formData.price);
    productData.append("warranty", formData.warrantyPeriod);
    productData.append("conditions", formData.conditions);
    productData.append("status", formData.status);
    productData.append("dateAdded", formData.dateAdded);
    if(typeof formData.images !=="string" && formData.images.length>0){
      formData.images.forEach((image, index) => {
        productData.append("images", image);
      }); 
    }
    try {
      const resp= await axios.post(`/api/product/update-product/${formData.productId}`,productData, {
        headers:{
            "Content-Type": 'multipart/form-data'
        }
      })
      setToastMessage({
        variant: "success",
        message: resp.data.message,
      });
      await getProducts()
      setShowEditModal(false)
    } catch (error) {
      setToastMessage({
        variant: "danger",
        message: error.message,
      } );
      
    }
  };
  const handleView = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData( product);
    setShowEditModal(true);
  };

 

  const handleDelete = async(product) => {
    console.log(product)
    try {
      const resp= await axios.delete(`/api/product/delete-product/${product.productId}`, {
        headers:{
            "Content-Type": 'multipart/form-data'
        }
      })
      setToastMessage({
        variant: "success",
        message: resp.data.message,
      });
      await getProducts()
      setShowEditModal(false)
    } catch (error) {
      setToastMessage({
        variant: "danger",
        message: error.message,
      } );
      
    }
  };
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };
  const handleDeleteConfirm = () => {
    console.log('Deleting product:', selectedProduct);
    // Implement your delete logic here
    setShowDeleteModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Product Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Price</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Model</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Vehicle</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.productId} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-800">{product.productName}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{categories.find((category, index)=>category.categoryId==product.categoryId)?.categoryName}</td>
                <td className="px-4 py-3 text-sm text-gray-800">${product.price}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{product.type_model}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{product.vehicleCompatible}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.status === 'instock' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleView(product)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleEdit(product)}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <Edit  className="w-5 h-5" />
                    </button>
                    <button 
                       onClick={() => handleDelete(product)}
                      className="text-red-600 hover:text-red-800"
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

      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Product Name</h3>
                  <p className="mt-1">{selectedProduct.productName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="mt-1">{categories.find(category=>category.categoryId==selectedProduct.categoryId).categoryName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Price</h3>
                  <p className="mt-1">${selectedProduct.price}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Model Type</h3>
                  <p className="mt-1">{selectedProduct.type_model}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Size</h3>
                  <p className="mt-1">{selectedProduct.size}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Vehicle Compatibility</h3>
                  <p className="mt-1">{selectedProduct.vehicleCompatible}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Warranty Period</h3>
                  <p className="mt-1">{selectedProduct.warrantyPeriod}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date Added</h3>
                  <p className="mt-1">{formatDate(selectedProduct.dateAdded)}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Conditions</h3>
                  <p className="mt-1">{selectedProduct.conditions}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{selectedProduct.description}</p>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => setShowViewModal(false)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="productName" className="block text-sm font-medium">
              Product Name
            </label>
            <input
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((category, index)=>{
                return <option key={index} value={category.categoryId}> {category.categoryName}</option>
              })}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="type_model" className="block text-sm font-medium">
              Type/Model
            </label>
            <input
              id="type_model"
              name="type_model"
              value={formData.type_model}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="vehicleCompatible" className="block text-sm font-medium">
              Vehicle Compatibility
            </label>
            <input
              id="vehicleCompatible"
              name="vehicleCompatible"
              value={formData.vehicleCompatible}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="size" className="block text-sm font-medium">
              Size
            </label>
            <input
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium">
              Price
            </label>
            <input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="warrantyPeriod" className="block text-sm font-medium">
              Warranty Period
            </label>
            <input
              id="warrantyPeriod"
              name="warrantyPeriod"
              value={formData.warrantyPeriod}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="instock">In Stock</option>
              <option value="outofstock">Out of Stock</option>
              <option value="preorder">Pre-order</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="images" className="block text-sm font-medium">
            Images
          </label>
          <input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            className="w-full border border-gray-300 rounded-md p-2"
            onChange={handleChange}
          />
           {imagePreview.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {imagePreview.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md"
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 h-32"
          ></textarea>
        </div>

        <div className="space-y-2">
          <label htmlFor="conditions" className="block text-sm font-medium">
            Conditions
          </label>
          <textarea
            id="conditions"
            name="conditions"
            value={formData.conditions}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 h-24"
          ></textarea>
        </div>

        <Modal.Footer>
          <button
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 mr-2"
          >
            Cancel
          </button>
          <button type= "submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </Modal.Footer>
      </form>
        </Modal.Body>
       
      </Modal>

      <Modal 
    show={showDeleteModal} 
    onHide={() => setShowDeleteModal(false)}
    centered
  >
    <Modal.Header className="border-b">
      <Modal.Title className="text-lg font-semibold">Confirm Delete</Modal.Title>
    </Modal.Header>
    <Modal.Body className="py-6">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <div className="flex-grow">
          <h4 className="text-lg font-medium mb-2">Delete Product</h4>
          <p className="text-gray-600">
            Are you sure you want to delete "{selectedProduct?.productName}"? 
            This action cannot be undone.
          </p>
        </div>
      </div>
    </Modal.Body>
    <Modal.Footer className="border-t">
      <button
        onClick={() => setShowDeleteModal(false)}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 mr-2"
      >
        Cancel
      </button>
      <button
        onClick={handleDeleteConfirm}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Delete
      </button>
    </Modal.Footer>
  </Modal>
    </div>
  );
};

export default ProductTable;