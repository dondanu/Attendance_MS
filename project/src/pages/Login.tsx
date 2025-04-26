import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { CalendarClock, User, Lock, AlertCircle, Moon, Sun, Eye, EyeOff } from 'lucide-react';
import eventIllustration from '../assets/img.png';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Left Panel - Company Info */}
      <div className={`hidden lg:flex w-1/2 p-8 items-center justify-center ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-blue-400'}`}>
        
        <div className={`max-w-xl w-full p-8 rounded-2xl shadow-xl ${
          theme === 'dark' 
            ? 'bg-gray-900 border-2 border-gray-700' 
            : 'bg-white border-2 border-blue-100'}`}>
          
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="space-y-4">
              <div className="flex justify-center">
                <CalendarClock  
                  size={38}  
                  className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} mb-4 `} 
                />
                <h1 className={`${theme === 'dark' ? 'text-blue-400' : 'text-white'}`}> ~</h1>
                
              <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                ATMS
              </h1>
            </div>
            </div>

            <div className="space-y-4">
            
              <p className={`text-lg px-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Professional event management solution for modern organizations. 
                Schedule, manage, and collaborate with ease.
              </p>
              
              <div className="pt-4">
                <img 
                  src={eventIllustration} 
                  alt="Event Management Illustration" 
                  className="max-w-full h-auto mx-auto"
                  style={{ maxHeight: '280px' }}
                />
              </div>
            </div>

            <div className={`mt-8 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2025 eventflow. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center p-4 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        
        <div className={`max-w-md w-full p-8 rounded-2xl shadow-xl ${
          theme === 'dark' 
            ? 'bg-gray-900 border-2 border-gray-700' 
            : 'bg-white border-2 border-gray-200'}`}>
          
          <div className="flex justify-between items-center mb-8">
            <CalendarClock size={32} className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg hover:bg-gray-100 ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {theme === 'dark' ? (
                <Sun size={24} className="text-yellow-400" />
              ) : (
                <Moon size={24} className="text-gray-600" />
              )}
            </button>
          </div>

          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Welcome Back!
            </h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Sign in to continue to eventflow
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className={`p-3 rounded-lg flex items-center border ${
                theme === 'dark' 
                  ? 'bg-red-900/50 text-red-200 border-red-700' 
                  : 'bg-red-100 text-red-800 border-red-200'}`}>
                <AlertCircle size={20} className="mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="username" className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <User size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`appearance-none block w-full pl-10 pr-3 py-3 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500'
                    }`}
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Lock size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`appearance-none block w-full pl-10 pr-10 py-3 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                    ) : (
                      <Eye size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className={`h-4 w-4 rounded ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500'
                      : 'border-gray-300 text-blue-600 focus:ring-blue-500'
                  }`}
                />
                <label htmlFor="remember-me" className={`ml-2 block text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  to="/forgot-password" 
                  className={`font-medium ${
                    theme === 'dark' 
                      ? 'text-blue-400 hover:text-blue-300' 
                      : 'text-blue-600 hover:text-blue-500'
                  }`}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              } ${theme === 'dark' ? 'focus:ring-blue-500' : 'focus:ring-blue-500'}`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;