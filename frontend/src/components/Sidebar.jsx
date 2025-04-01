import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Folder,
  MessageSquare,
  Settings,
  ChevronRight,
  Store,
  MenuIcon,
  X
} from 'lucide-react';
import useUser from '../hooks/useUser';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const user= useUser()

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { path: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: 'product', icon: Package, label: 'Products' },
    { path: 'categories', icon: Folder, label: 'Categories' },
    { path: 'messages', icon: MessageSquare, label: 'Messages' },
    
  ];

  const isCurrentPath = (path) => location.pathname.includes(path);

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
        ${isExpanded ? 'lg:w-64' : 'lg:w-20'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="hidden lg:flex absolute -right-3 top-10 bg-white border border-gray-200 rounded-full p-1.5 hover:bg-gray-50 z-50"
        >
          <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
            isExpanded ? '' : 'rotate-180'
          }`} />
        </button>

        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute right-4 top-4"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>

        <div className="flex items-center gap-3 px-4 py-6 border-b border-gray-100">
        <img
                src="/mechstore_logo.jpeg"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
              />
          {isExpanded && (
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold text-gray-900">MechStore</h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-1 mt-4">
          {menuItems.map((item) => {
            const isActive = isCurrentPath(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 no-underline
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${
                  isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                }`} />
                
                {isExpanded && (
                  <span className="hidden lg:block font-medium truncate">
                    {item.label}
                  </span>
                )}
                
                <span className="lg:hidden font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img
                src="/mechstore_logo.jpeg"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            </div>
            {isExpanded && (
              <div className="hidden lg:block min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed lg:hidden left-4 top-4 z-50"
      >
        <MenuIcon className="w-6 h-6 text-gray-500" />
      </button>
    </>
  );
};

export default Sidebar;