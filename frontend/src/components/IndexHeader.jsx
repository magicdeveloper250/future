import React from "react";
import { FaBell, FaEnvelope, FaSearch, FaWhatsapp } from "react-icons/fa";
import { MdFavoriteBorder } from "react-icons/md";
import { FaUserLarge } from "react-icons/fa6";
import {Link} from "react-router-dom";

const IndexHeader = () => {
  const whatsappLink = "https://wa.me/0798586575"; // Replace with your WhatsApp number

  return (
    <div className=" shadow-md p-4 flex justify-between items-center">
      <div className="p-4 mb-10">
        {/* Replace 'logo.png' with your image path */}
        <img
          src="mechstore_logo.jpeg"
          alt="Logo" width={150} height={150}
          className="object-cover lg:w-32"
        />
      </div>
      {/* Search Bar */}
      <div className="flex items-centerrounded-lg px-4 py-2 ">
        <FaSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className=" outline-none w-full"
        />
      </div>

      <div className="flex items-center space-x-6">
        
        <MdFavoriteBorder  />
        <Link to={"sign-in"} className="bg-white"><FaUserLarge /></Link>
      </div>

    </div>
  );
};

export default IndexHeader;
