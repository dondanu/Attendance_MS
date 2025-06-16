import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, Moon, Sun, LogOut, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import img2 from '../assets/img3.jpg';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Handle search navigation
  const handleSearch = (searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    if (term === 'dashboard') navigate('/');
    else if (term === 'attendance management') navigate('/attendance');
    else if (term === 'organization') navigate('/organization');
    else if (term === 'employee') navigate('/employee');
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10 py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
      {/* Left: Menu button and title */}
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 p-1 rounded-md lg:hidden"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white ml-4">
          Attendance Management System
        </h1>
      </div>
      
      {/* Right: Search, notifications, theme toggle, profile */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className={`relative ${searchOpen ? 'w-64' : 'w-auto'} transition-all duration-300`}>
          {searchOpen ? (
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                onBlur={() => setSearchOpen(false)}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Search size={20} />
            </button>
          )}
        </div>
        
        
        
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            className="flex items-center focus:outline-none"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            

<img 
  src={img2} 
  alt={user?.name} 
  className="h-8 w-8 rounded-full object-cover" 
/>

          </button>
          
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-700">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-800 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;