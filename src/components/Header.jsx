import { useState } from 'react';
import { Link } from 'react-router';
import { FaBars, FaTimes } from 'react-icons/fa';
import Navbar from './Navbar';
import logoImage from '../assets/logo.webp';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={logoImage} alt="Aeroboost" className="h-12" />
        </Link>
        
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-primary focus:outline-none"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        
        <div className={`md:flex ${isMenuOpen ? 'block absolute top-20 left-0 right-0 bg-white p-4 shadow-md' : 'hidden'}`}>
          <Navbar setIsMenuOpen={setIsMenuOpen} />
        </div>
      </div>
    </header>
  );
};

export default Header;