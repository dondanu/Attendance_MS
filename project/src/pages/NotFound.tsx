import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 dark:bg-blue-700 h-2"></div>
        <div className="p-8 text-center">
          <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-500">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-4">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
            <Button 
              variant="secondary" 
              icon={<ArrowLeft size={16} />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button 
              variant="primary" 
              icon={<Home size={16} />}
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;