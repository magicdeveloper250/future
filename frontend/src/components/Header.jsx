import React, { useState, useRef, useEffect } from 'react';
import { FaBell, FaEnvelope, FaSearch, FaWhatsapp, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { MdAccountCircle } from 'react-icons/md';
import { Link } from 'react-router';
import useUser from '../hooks/useUser';
import useMessages from '../hooks/useMessages';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const whatsappLink = "https://wa.me/0798586575";
  const user= useUser()
  const{newMessage}=useMessages()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-md px-4 py-3 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-1/3">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-100 outline-none w-full"
          />
        </div>

        <div className="flex  justify-between items-center space-x-9">
          <button className="md:hidden">
            <FaSearch className="text-gray-600 text-xl" />
          </button>

          <Link className="relative group no-underline" to={"messages"}>
            <FaEnvelope className="text-gray-600 text-xl hover:text-gray-800 transition-colors" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {newMessage.length}
            </span>
          </Link>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block"
          >
            <FaWhatsapp className="text-green-500 text-2xl hover:text-green-600 transition-colors" />
          </a>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2 transition-colors"
            >
              <MdAccountCircle className="text-gray-600 text-2xl" />
              <span className="hidden sm:block text-sm text-gray-700">{user.username}</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                {/* <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                  <FaUserCircle className="text-gray-500" />
                  <span>Profile</span>
                </button> */}
                <Link to={"/logout"} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2 no-underline">
                  <FaSignOutAlt className="text-gray-500" />
                  <span>Logout</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;