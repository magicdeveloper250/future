import "./FantasticHomeNavbar.css";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { AlignLeft, X } from 'lucide-react';
import { MdFavoriteBorder } from "react-icons/md";
import { FaUserLarge } from "react-icons/fa6";
import {
  Box,
  Drawer,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import SearchBar from "../SearchBar";

function FantasticHomeNavbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  const links = [
    { id: "hero", label: "Home", icon: "fas fa-home" },
    { id: "categories", label: "Categories", icon: "fas fa-list" },
    { id: "best-selling", label: "Best Selling", icon: "fas fa-fire" },
    { id: "today-deals", label: "Today's Deals", icon: "fas fa-tag" },
    { id: "new-arrivals", label: "New Arrivals", icon: "fas fa-star" },
  ];
  const [activeLink, setActiveLink] = useState("categories");
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const marginTop = 110;
      const scrollToY = element.getBoundingClientRect().top + window.scrollY - marginTop;
      window.scrollTo({ top: scrollToY, behavior: "smooth" });
    }
    setOpenMenu(false);
  };
  
  const determineActiveSection = () => {
    for (let i = 0; i < links.length; i++) {
      const section = document.getElementById(links[i].id);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < 120 && rect.bottom >= 120) {
          setActiveLink(links[i].id);
          break;
        }
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      determineActiveSection();
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar-container ${isScrolled ? "scrolled" : ""}`}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="p-2 md:hidden focus:outline-none text-slate-200"
              ref={menuRef}
            >
              <AlignLeft className="h-6 w-6" />
            </button>
            <Link to="/" className="hidden md:flex items-center">
              <img src="/logo/logo.svg" alt="Future Electronics logo" className="h-20 mx-auto object-cover rounded-lg w-auto" />
            </Link>
          </div>
          
          <div className="flex-1 max-w-xl mx-4">
            <SearchBar />
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/login" className="p-2 hover:opacity-80 transition-opacity">
              <FaUserLarge className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
      
      <div className="fantstic-nav-container border-t">
        <div className="container mx-auto px-4">
          <ul className="links-container flex justify-center space-x-8 h-12 items-center">
            {links.map(({ id, label, icon }) => (
              <li key={id} className="link-item">
                <Link 
                  to={`#${id}`}
                  className={`flex items-center space-x-2 py-2 rounded-md text-center px-2 ${activeLink === id ? `${isScrolled ? "text-black bg-slate-200" : "text-slate-200 bg-black"} font-medium`: "hover:opacity-80"}`} 
                  onClick={() => scrollToSection(id)}
                >
                  <i className={icon}></i>
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Drawer
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        anchor="right"
        className="user-profile-drawer"
        PaperProps={{
          sx: {
            width: 280,
            borderTopLeftRadius: '12px',
            borderBottomLeftRadius: '12px',
            backgroundColor: '#f8f9fa',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
          }
        }}
        style={{ zIndex: 12001 }}
      >
        <Box className="mobile-drawer">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <img src="/logo/logo.svg" alt="Logo" className="h-10 w-auto" />
            </div>
            <IconButton onClick={() => setOpenMenu(false)}  >
              <X className="h-5 w-5 text-slate-200" />
            </IconButton>
          </div>
          
         
          
          <List className="mt-2">
            {links.map(({ id, label, icon }) => (
              <ListItem key={id} disablePadding className="mb-1">
                <Link 
                  to="/" 
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors no-underline ${
                    activeLink === id 
                      ? "bg-black text-white font-medium" 
                      : "text-slate-200 hover:bg-blue-500"
                  }`}
                  onClick={() => scrollToSection(id)}
                >
                  <i className={`${icon} mr-3`}></i>
                  <span>{label}</span>
                </Link>
              </ListItem>
            ))}
          </List>
          
          <div className="border-t border-gray-200 mt-4 pt-4 px-4">
            <Link 
              to="/login" 
              className="flex items-center space-x-3 w-full px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-gray-800 no-underline"
            >
              <FaUserLarge className="h-4 w-4" />
              <span className="font-medium">Log in / Sign up</span>
            </Link>
          </div>
          
          <div className="p-4 text-center text-gray-500 text-sm border-t border-gray-200 mt-6">
            <p>© 2025 Future Electronics</p>
          </div>
        </Box>
      </Drawer>
    </nav>
  );
}

export default FantasticHomeNavbar;