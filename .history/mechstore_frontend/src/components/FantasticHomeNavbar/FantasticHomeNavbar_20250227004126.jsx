import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { AlignLeft } from 'lucide-react';
import { FaUserLarge } from "react-icons/fa6";
import {
  Box,
  Drawer,
  List,
  ListItem,
} from "@mui/material";
import SearchBar from "../SearchBar";

function FantasticHomeNavbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  const links = [
    { id: "hero", label: "Home", icon: "fas fa-home" },
    { id: "categories", label: "Categories", icon: "fas fa-home" },
    { id: "best-selling", label: "Best Selling", icon: "fas fa-images" },
    { id: "today-deals", label: "Today's Deals", icon: "fas fa-paint-brush" },
    { id: "new-arrivals", label: "New Arrivals", icon: "fas fa-info-circle" },
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
    <nav className={`flex flex-col fixed top-0 w-full z-[10000] py-2.5 px-px ${isScrolled ? 'bg-[#111C2F]' : 'bg-[rgba(3,30,70,0.862)]'}`}>
      {/* Top toolbar section */}
      <div className="flex justify-between items-center gap-8 mb-4">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="hidden md:hidden text-[rgba(255,255,255,0.84)] mx-4 w-fit"
            ref={menuRef}
          >
            <AlignLeft />
          </button>
          <img src="/logo/logo.svg" alt="Future Electronics logo" width={50} height={50} />
        </div>

        {/* SearchBar component would need its styles converted to Tailwind as well */}
        <div className="bg-[#111C2F] border border-white rounded-[20px] focus-within:bg-white focus-within:text-black focus-within:p-2.5 focus-within:rounded-[10px]">
          <SearchBar />
        </div>
        
        <div className="flex items-center space-x-6 md:flex-col md:justify-start md:items-center">
          <Link to={"login"}><FaUserLarge /></Link>
        </div>
      </div>
      
      {/* Navigation links section */}
      <div className="relative flex flex-col">
        <ul className="flex justify-evenly items-center gap-4 list-none p-0 m-0 md:hidden">
          {links.map(({ id, label, icon }) => (
            <li key={id} className="px-4">
              <Link 
                to={`#${id}`} 
                className={`no-underline text-[rgb(231,230,230)] ${activeLink === id ? 'text-white bg-[#101223] py-[15px] rounded-t-[15px]' : ''}`}
                onClick={() => scrollToSection(id)}
              >
                <i className={icon}></i> {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile drawer */}
        <Drawer
          open={openMenu}
          onClose={() => setOpenMenu(false)}
          anchor="right"
          className="user-profile-drawer"
          style={{ zIndex: 12001 }}
        >
          <Box sx={{ width: 250 }} className="bg-[rgba(3,30,70,0.862)] h-full">
            <List>
              {links.map(({ id, label, icon }) => (
                <ListItem key={id} className="px-4">
                  <Link 
                    to={"/"} 
                    className={`no-underline text-[rgb(231,230,230)] ${activeLink === id ? 'text-white bg-[#101223] py-[15px] rounded-t-[15px]' : ''}`}
                    onClick={() => scrollToSection(id)}
                  >
                    <i className={icon}></i> {label}
                  </Link>
                </ListItem>
              ))}
              <ListItem className="px-4">
                <Link to="/login" className="no-underline text-[rgb(231,230,230)]">
                  <i className="fas fa-sign-in-alt"></i> Log in
                </Link>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </div>
    </nav>
  );
}

export default FantasticHomeNavbar;