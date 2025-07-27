import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
        </div>
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            The page you're looking for doesn't exist. It might have been moved, 
            deleted, or you entered the wrong URL.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="btn btn-primary flex items-center justify-center"
          >
            <Home size={20} className="mr-2" />
            Go Home
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-secondary flex items-center justify-center"
          >
            <ArrowLeft size={20} className="mr-2" />
            Go Back
          </button>
        </div>
        
        <div className="mt-12">
          <div className="text-6xl mb-4">🍜</div>
          <p className="text-gray-500">
            Don't worry, there's still plenty of delicious food to discover!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;