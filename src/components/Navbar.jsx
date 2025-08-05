import { Link } from 'react-router';
import { FaUser } from 'react-icons/fa';
import CartIcon from './CartIcon';
import { useAuth } from '../admin/AuthProvider';

const Navbar = ({ setIsMenuOpen }) => {
  const { user } = useAuth();
  
  const closeMenu = () => {
    if (setIsMenuOpen) setIsMenuOpen(false);
  };
  
  return (
    <nav className="flex flex-col md:flex-row items-center gap-2 md:gap-0">
      <Link 
        to="/" 
        onClick={closeMenu} 
        className="px-4 py-2 text-gray-700 hover:text-primary transition-colors duration-300 font-medium hover:bg-gray-50 rounded-lg"
      >
        Inicio
      </Link>
      <Link 
        to="/servicios" 
        onClick={closeMenu} 
        className="px-4 py-2 text-gray-700 hover:text-primary transition-colors duration-300 font-medium hover:bg-gray-50 rounded-lg"
      >
        Cursos
      </Link>
      <Link 
        to="/sobre-nosotros" 
        onClick={closeMenu} 
        className="px-4 py-2 text-gray-700 hover:text-primary transition-colors duration-300 font-medium hover:bg-gray-50 rounded-lg"
      >
        Sobre Nosotros
      </Link>
      <Link 
        to="/blog" 
        onClick={closeMenu} 
        className="px-4 py-2 text-gray-700 hover:text-primary transition-colors duration-300 font-medium hover:bg-gray-50 rounded-lg"
      >
        Blog
      </Link>
      <Link 
        to="/contacto" 
        onClick={closeMenu} 
        className="px-4 py-2 text-gray-700 hover:text-primary transition-colors duration-300 font-medium hover:bg-gray-50 rounded-lg"
      >
        Contacto
      </Link>
      
      {/* Cart Icon */}
      <div className="ml-0 md:ml-2 mt-2 md:mt-0">
        <CartIcon />
      </div>
      
      {/* Student Dashboard Link (if logged in) or Login Link */}
      {user ? (
        <Link 
          to="/student/dashboard" 
          onClick={closeMenu} 
          className="ml-0 md:ml-2 mt-2 md:mt-0 px-4 py-2 bg-primary text-white rounded-full hover:bg-accent transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-2 shadow-lg"
        >
          <FaUser />
          Mi Dashboard
        </Link>
      ) : (
        <Link 
          to="/student/login" 
          onClick={closeMenu} 
          className="ml-0 md:ml-2 mt-2 md:mt-0 px-4 py-2 bg-gradient-primary text-white rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-2 shadow-lg"
        >
          <FaUser />
          Iniciar Sesión
        </Link>
      )}
    </nav>
  );
};

export default Navbar;