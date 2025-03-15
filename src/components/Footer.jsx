
import { Link } from 'react-router';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import logoImage2 from '../assets/logo2.webp';


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto w-full">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src={logoImage2} alt="Aeroboost" className="h-12 mb-4" />
            <p className="text-gray-400 mb-4">
            Formando profesionales de excelencia para la industria aeronáutica.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/people/Aeroboost-Learning-Center/61573787828834/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaXTwitter size={24} />
              </a>
              <a href="https://www.instagram.com/aeroboost.lc/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="https://www.linkedin.com/company/aeroboost-lc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin size={24} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaYoutube size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/servicios" className="text-gray-400 hover:text-white transition-colors">Servicios</Link>
              </li>
              <li>
                <Link to="/sobre-nosotros" className="text-gray-400 hover:text-white transition-colors">Sobre Nosotros</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-400 hover:text-white transition-colors">Contacto</Link>
              </li>
            </ul>
          </div>
          
          
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contáctanos</h3>
            <p className="text-gray-400 mb-2"></p>
            <p className="text-gray-400 mb-2"></p>
            <p className="text-gray-400 mb-4">info@aeroboost.com.ar</p>
            <a 
              href="https://aulavirtual.aeroboost.com.ar/login/index.php" 
              target="_blank" 
              rel="noopener noreferrer" 
               
              className="ml-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Aula Virtual
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Aeroboost. Todos los derechos reservados.</p>
          <Link to="/admin/login" className="text-gray-600 text-xs mt-2 inline-block hover:text-gray-400 transition-colors">
            Administración
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;