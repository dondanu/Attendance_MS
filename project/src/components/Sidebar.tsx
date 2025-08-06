import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import img2 from '../assets/img3.jpg';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  CalendarClock, 
  Building2, 
  Users, 
  X,
  LogOut,
  UserPlus,
  ClipboardList,
  BarChart2,
  Settings,
  Briefcase,
  Tag,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState<boolean[]>([]);

  const navLinks = [
    { 
      name: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard size={20} />
    },
    {
      name: 'Attendance',
      path: '/attendance',
      icon: <CalendarClock size={20} />,
      subItems: [
        { name: 'View Attendance', path: '/attendance', icon: <ClipboardList size={18} /> },
        { name: 'Add Attendance', path: '/attendance/new', icon: <CalendarClock size={18} /> },
        { name: 'Attendance Report', path: '/attendance/report', icon: <BarChart2 size={18} /> }
      ]
    },
    {
      name: 'Organization',
      path: '/organization',
      icon: <Building2 size={20} />,
      subItems: [
        { name: 'Overview', path: '/organization', icon: <Settings size={18} /> },
        { name: 'Designations', path: '/organization/designation', icon: <Briefcase size={18} /> },
        { name: 'Status', path: '/organization/status', icon: <Tag size={18} /> }
      ]
    },
    {
      name: 'Employee',
      path: '/employee',
      icon: <Users size={20} />,
      subItems: [
        { name: 'View Employees', path: '/employee', icon: <Users size={18} /> },
        { name: 'Add Employee', path: '/employee/add', icon: <UserPlus size={18} /> }
      ]
    },
  ];

  useEffect(() => {
    const initialStates = navLinks.map(link => 
      link.subItems?.some(subItem => location.pathname === subItem.path) ?? false
    );
    setOpenDropdowns(initialStates);
  }, []);

  useEffect(() => {
    const newStates = navLinks.map(link => 
      link.subItems?.some(subItem => location.pathname === subItem.path) ?? false
    );
    setOpenDropdowns(newStates);
  }, [location.pathname]);

  const toggleDropdown = (index: number) => {
    setOpenDropdowns(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const isActiveParent = (link: any) => {
    return link.subItems?.some((subItem: any) => location.pathname === subItem.path);
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-600/75 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 flex flex-col z-30 w-64
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <span className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xl">
              AM
            </span>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Attendance MS</h1>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="p-1 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
          >
            <X size={24} className="transition-transform duration-200 hover:rotate-90" />
          </button>
        </div>
        
        {/* User info */}
        <div className="flex items-center space-x-3 p-4 border-b border-gray-200 dark:border-gray-700">
          <img 
            src={img2} 
            alt={user?.name} 
            className="h-8 w-8 rounded-full object-cover transition-transform duration-200 hover:scale-110" 
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-white">{user?.name}</span>
            <span style={{ fontSize: '19px' }} className="text-gray-500 dark:text-gray-400">{user?.role}</span>

          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navLinks.map((link, index) => (
              <li key={link.path}>
                {link.subItems ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(index)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200
                        ${isActiveParent(link)
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                    >
                      <span className="mr-3">{link.icon}</span>
                      {link.name}
                      <span className={`ml-auto transition-transform duration-200 ${openDropdowns[index] ? 'rotate-180' : ''}`}>
                        <ChevronDown size={16} />
                      </span>
                    </button>
                    <div className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${openDropdowns[index] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                    `}>
                      <ul className="ml-6 space-y-1 py-1">
                        {link.subItems.map((subItem) => (
                          <li key={subItem.path}>
                            <NavLink
                              to={subItem.path}
                              className={({ isActive }) => `
                                flex items-center px-4 py-2 text-sm font-medium rounded-md
                                transition-colors duration-200
                                ${isActive 
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                                }`
                              }
                              end
                            >
                              <span className="mr-3">{subItem.icon}</span>
                              {subItem.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => `
                      flex items-center px-4 py-3 text-sm font-medium rounded-md
                      transition-colors duration-200
                      ${isActive 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`
                    }
                    end
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.name}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Logout button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-md 
                      hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;