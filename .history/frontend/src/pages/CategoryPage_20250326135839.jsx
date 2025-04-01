import React, { useState } from 'react';
import { Heart, Truck, RotateCcw, Activity, ArrowLeft } from 'lucide-react';
import { useLocation, useParams, useNavigate } from 'react-router';
import { FaWhatsapp } from "react-icons/fa";
import { Modal, Button, Form } from 'react-bootstrap';
import axios from '../API/axios';
import useToast from '../hooks/useToast';

const CategoryPage = () => {
  const navigate = useNavigate();
  const productId = useParams().id;
  const { setToastMessage } = useToast();
  const images = useLocation().state.images;
  const product = useLocation().state.product;
  const [message, setMessage] = useState({
    productId: productId,
    email: "",
    phone: "",
    location: "",
    message: ""
  });
  
  const [currentImage, setCurrentImage] = useState(images[0]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const whatsappLink = `https://wa.me/${import.meta.env.VITE_PHONE_NUMBER}`;
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setMessage({...message, [e.target.name]: e.target.value});
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 200;
    const y = ((e.clientY - top) / height) * 200;
    setMousePosition({ x, y });
  };

  const contactUs = async(e) => {
    e.preventDefault();
    try {
      const resp = await axios.post("/api/product/contact-us", JSON.stringify(message));
      handleCloseModal();
      setToastMessage({
        variant: "success",
        message: resp.data.message,
      });
    } catch (error) {
      setToastMessage({
        variant: "danger",
        message: resp.data.message,
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
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div 
            className="bg-amber-50 rounded-lg p-4 overflow-hidden relative cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            style={{ height: '400px' }}
          >
            <img
              src={currentImage}
              alt="Main product"
              className={`w-full h-full object-contain transition-transform duration-200 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={isZoomed ? {
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
              } : undefined}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                onClick={() => setCurrentImage(image)}
                alt={`Product thumbnail ${index}`}
                className="w-full h-auto bg-gray-900 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.productName}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-500">{product.category}</span>
              <span className="ml-auto text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-sm font-medium">
                {product.status}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <div className="font-medium">Model</div>
                <div className="text-sm text-gray-500">{product.type_model}</div>
              </div>
            </div>
            
            <div className="text-2xl font-bold mb-4">
              {String(new Intl.NumberFormat('US-en', { style: 'currency', currency: 'RWF' }).format(product.price))}
            </div>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Truck className="w-6 h-6" />
              <div>
                <div className="font-medium">Vehicle Compatibility</div>
                <div className="text-sm text-gray-500">{product.vehicleCompatible}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <RotateCcw className="w-6 h-6" />
              <div>
                <div className="font-medium">Warranty</div>
                <div className="text-sm text-gray-500">{product.warrantyPeriod}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Activity className="w-6 h-6" />
              <div>
                <div className="font-medium">Conditions</div>
                <div className="text-sm text-gray-500">{product.conditions}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-6 py-2 bg-gray-800 text-white hover:bg-gray-600 rounded" onClick={handleShowModal}>
              Message Us
            </button>
            <button className="p-2 border rounded hover:bg-gray-50">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="w-6 h-6 text-green-700" />
              </a>
            </button>
           
          </div>

          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Send Us a Message</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={contactUs}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    required
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    required
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    required
                    onChange={handleChange}
                    placeholder="Enter your location"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="message"
                    rows={4}
                    required
                    onChange={handleChange}
                    placeholder="Enter your message"
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="dark" type="submit">
                    Submit
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;