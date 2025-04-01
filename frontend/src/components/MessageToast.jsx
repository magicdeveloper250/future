import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import useMessages from '../hooks/useMessages';

const ToastContainer = ({ position = 'bottom-end', children }) => {
  const positionClasses = {
    'top-start': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-end': 'top-4 right-4',
    'middle-start': 'top-1/2 left-4 -translate-y-1/2',
    'middle-center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'middle-end': 'top-1/2 right-4 -translate-y-1/2',
    'bottom-start': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-end': 'bottom-4 right-4',
  };

  return (
    <div className={`fixed z-50 ${positionClasses[position]}`}>
      {children}
    </div>
  );
};

const Toast = ({ onClose, show, delay = 3000, autohide = true, variant = 'info', title, children, sound = '/notification.mp3' }) => {
  const audioRef = useRef(null);
  const variants = {
    success: 'bg-green-500 text-white',
    danger: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black',
    info: 'bg-blue-500 text-white',
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-gray-600 text-white',
    light: 'bg-gray-100 text-black',
    dark: 'bg-gray-800 text-white',
  };

  useEffect(() => {
    if (show) {
      audioRef.current?.play().catch(err => console.log('Audio playback failed:', err));
      
      if (autohide) {
        const timer = setTimeout(() => {
          onClose();
        }, delay);
        return () => clearTimeout(timer);
      }
    }
  }, [show, autohide, delay, onClose]);

  if (!show) return null;

  return (
    <>
      <audio ref={audioRef} src={sound} />
      <div className={`
        transform transition-all duration-300 ease-in-out
        ${show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
        min-w-[320px] max-w-md rounded-lg shadow-lg
        ${variants[variant]}
      `}>
        <div className="relative flex flex-col">
          {title && (
            <div className="px-4 py-2 border-b border-white/20 font-semibold">
              {title}
            </div>
          )}
          <div className="flex items-center p-4">
            <div className="flex-1 mr-4">
              {children}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-black/10 transition-colors duration-200"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const MessageToast = () => {
  const { newMessage } = useMessages();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (newMessage.at(-1)?.message) {
      setShow(true);
    }
  }, [newMessage]);

  return (
    newMessage && (
      <ToastContainer position="bottom-end">
        <Toast
          show={show}
          onClose={() => setShow(false)}
          delay={3000}
          variant="info"
          title="New Message"
          sound="/notification.mp3"
        >
          <div className="font-medium">
            {newMessage.at(-1)?.message}
          </div>
        </Toast>
      </ToastContainer>
    )
  );
};

export default MessageToast;