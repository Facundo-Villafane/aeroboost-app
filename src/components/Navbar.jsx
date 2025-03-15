
import { Link } from 'react-router';

const Navbar = ({ setIsMenuOpen }) => {
  const closeMenu = () => {
    if (setIsMenuOpen) setIsMenuOpen(false);
  };
  
  return (
    <nav className="flex flex-col md:flex-row items-center">
      <Link to="/" onClick={closeMenu} className="px-4 py-2 text-darkText hover:text-primary transition-colors">
        Home
      </Link>
      <Link to="/servicios" onClick={closeMenu} className="px-4 py-2 text-darkText hover:text-primary transition-colors">
        Servicios
      </Link>
      <Link to="/sobre-nosotros" onClick={closeMenu} className="px-4 py-2 text-darkText hover:text-primary transition-colors">
        Sobre Nosotros
      </Link>
      <Link to="/blog" onClick={closeMenu} className="px-4 py-2 text-darkText hover:text-primary transition-colors">
        Blog
      </Link>
      <Link to="/contacto" onClick={closeMenu} className="px-4 py-2 text-darkText hover:text-primary transition-colors">
        Contacto
      </Link>
      <a 
        href="https://aulavirtual.aeroboost.com.ar/login/index.php" 
        target="_blank" 
        rel="noopener noreferrer" 
        onClick={closeMenu} 
        className="ml-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Aula Virtual
      </a>
    </nav>
  );
};

export default Navbar;