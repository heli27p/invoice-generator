import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        {/* Logo section (optional, can be added here) */}
        <div className="text-white text-xl">Logo</div>
        
        {/* Buttons aligned to the right */}
        <div className="ml-auto space-x-4">
          <Link to="/">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              CREATE INVOICE
            </button>
          </Link>
          <Link to="/invoiceslist">
            <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
              INVOICES
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
