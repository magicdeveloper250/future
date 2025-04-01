import { useEffect, useState } from "react";
import useToast from "../hooks/useToast";
 
const ToastContainer = ({ position = "bottom-end", className, children }) => {
  const positionClasses = {
    "top-start": "top-0 left-0",
    "top-center": "top-0 left-1/2 -translate-x-1/2",
    "top-end": "top-0 right-0",
    "middle-start": "top-1/2 left-0 -translate-y-1/2",
    "middle-center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "middle-end": "top-1/2 right-0 -translate-y-1/2",
    "bottom-start": "bottom-0 left-0",
    "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
    "bottom-end": "bottom-0 right-0",
  };

  return (
    <div className={`fixed p-3 z-50 ${positionClasses[position]} ${className}`}>
      {children}
    </div>
  );
};

const Toast = ({ onClose, show, delay, autohide, bg, children }) => {
  const bgColors = {
    success: "bg-green-500 text-white",
    danger: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500 text-white",
    primary: "bg-blue-600 text-white",
    secondary: "bg-gray-600 text-white",
    light: "bg-gray-100 text-black",
    dark: "bg-gray-800 text-white",
  };

  useEffect(() => {
    if (show && autohide) {
      const timer = setTimeout(() => {
        onClose();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [show, autohide, delay, onClose]);

  if (!show) return null;

  return (
    <div
      className={`
        rounded shadow-lg min-w-[200px] max-w-[350px] 
        transition-opacity duration-300 ease-in-out
        ${bgColors[bg] || bgColors.light}
      `}
    >
      <div className="relative">
        <button 
          onClick={onClose}
          className="absolute right-2 top-2 text-current opacity-70 hover:opacity-100"
        >
          ×
        </button>
        <div className="p-3">
          {children}
        </div>
      </div>
    </div>
  );
};

function MyToast() {
  const { toastMessage } = useToast();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, [toastMessage]);

  return (
    toastMessage && (
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          onClose={() => setShow(false)}
          show={show}
          delay={3000}
          autohide
          bg={toastMessage.variant.toLowerCase()}
        >
          <div>{toastMessage.message}</div>
        </Toast>
      </ToastContainer>
    )
  );
}

export default MyToast;