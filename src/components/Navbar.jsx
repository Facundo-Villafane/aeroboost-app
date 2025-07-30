import { Link } from 'react-router';
import { FaGraduationCap } from 'react-icons/fa';

const Navbar = ({ setIsMenuOpen }) => {
  const closeMenu = () => {
    if (setIsMenuOpen) setIsMenuOpen(false);
  };
  
  return (
    <nav className="flex flex-col md:flex-row items-center gap-2 md:gap-0">
      <Link 
        to="/" 
        onClick={closeMenu} 
        className="px-4 py-2 text-complement hover:text-secondary transition-colors duration-300 font-medium"
      >
        Inicio
      </Link>
      <Link 
        to="/servicios" 
        onClick={closeMenu} 
        className="px-4 py-2 text-complement hover:text-secondary transition-colors duration-300 font-medium"
      >
        Cursos
      </Link>
      <Link 
        to="/sobre-nosotros" 
        onClick={closeMenu} 
        className="px-4 py-2 text-complement hover:text-secondary transition-colors duration-300 font-medium"
      >
        Sobre Nosotros
      </Link>
      <Link 
        to="/blog" 
        onClick={closeMenu} 
        className="px-4 py-2 text-complement hover:text-secondary transition-colors duration-300 font-medium"
      >
        Blog
      </Link>
      <Link 
        to="/contacto" 
        onClick={closeMenu} 
        className="px-4 py-2 text-complement hover:text-secondary transition-colors duration-300 font-medium"
      >
        Contacto
      </Link>
      
      {/* Botón CTA - Aula Virtual */}
      <a 
        href="https://aula.codisea.dev/" 
        target="_blank" 
        rel="noopener noreferrer" 
        onClick={closeMenu} 
        className="ml-0 md:ml-4 mt-2 md:mt-0 px-6 py-2 bg-secondary text-complement rounded-full hover:bg-accent transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-2 shadow-lg"
      >
        <FaGraduationCap />
        Aula Virtual
      </a>
    </nav>
  );
};

export default Navbar;