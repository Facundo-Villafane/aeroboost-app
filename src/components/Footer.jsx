import { Link } from 'react-router';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaCode, FaHeart, FaGamepad, FaPython, FaGlobe, FaRobot, FaEnvelope, FaPhone, FaClock, FaGraduationCap } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-darkText text-white mt-auto w-full">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-secondary to-complementary p-2 rounded-lg mr-3">
                <FaCode className="text-darkText text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  <span className="text-secondary">COD</span>
                  <span className="text-white">I</span>
                  <span className="text-complementary">SEA</span>
                </h2>
              </div>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Formando los programadores del futuro. Enseñamos a niños y jóvenes 
              a crear, innovar y transformar el mundo a través del código.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://facebook.com/codisea" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-complementary transition-colors duration-300 p-2 bg-white/10 rounded-lg hover:bg-secondary/20"
              >
                <FaFacebook size={20} />
              </a>
              <a 
                href="https://instagram.com/codisea" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-complementary transition-colors duration-300 p-2 bg-white/10 rounded-lg hover:bg-secondary/20"
              >
                <FaInstagram size={20} />
              </a>
              <a 
                href="https://linkedin.com/company/codisea" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-complementary transition-colors duration-300 p-2 bg-white/10 rounded-lg hover:bg-secondary/20"
              >
                <FaLinkedin size={20} />
              </a>
              <a 
                href="https://youtube.com/codisea" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-complementary transition-colors duration-300 p-2 bg-white/10 rounded-lg hover:bg-secondary/20"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-secondary">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-400 hover:text-complementary transition-colors duration-300 hover:translate-x-1 transform inline-block"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link 
                  to="/servicios" 
                  className="text-gray-400 hover:text-complementary transition-colors duration-300 hover:translate-x-1 transform inline-block"
                >
                  Cursos
                </Link>
              </li>
              <li>
                <Link 
                  to="/sobre-nosotros" 
                  className="text-gray-400 hover:text-complementary transition-colors duration-300 hover:translate-x-1 transform inline-block"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-gray-400 hover:text-complementary transition-colors duration-300 hover:translate-x-1 transform inline-block"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/contacto" 
                  className="text-gray-400 hover:text-complementary transition-colors duration-300 hover:translate-x-1 transform inline-block"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Cursos destacados */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-complementary">Cursos Populares</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/servicios#scratch-principiantes" 
                  className="text-gray-400 hover:text-complementary transition-colors duration-300 hover:translate-x-1 transform inline-block flex items-center gap-1"
                >
                  <FaGamepad className="text-secondary" />
                  Scratch para Principiantes
                </Link>
              </li>
              <li>
                <Link 
                  to="/servicios#python-jovenes" 
                  className="text-gray-400 hover:text-complementary transition-colors duration-300 hover:translate-x-1 transform inline-block flex items-center gap-1"
                >
                  <FaPython className="text-secondary" />
                  Python para Jóvenes
                </Link>
              </li>
              <li>
                <Link 
                  to="/servicios#desarrollo-web" 
                  className="text-gray-400 hover:text-complementary transition-colors duration-300 hover:translate-x-1 transform inline-block flex items-center gap-1"
                >
                  <FaGlobe className="text-secondary" />
                  Desarrollo Web
                </Link>
              </li>
              <li>
                <a 
                  href="/servicios" 
                  className="text-gray-400 hover:text-complementary transition-colors duration-300 hover:translate-x-1 transform inline-block flex items-center gap-1"
                >
                  <FaRobot className="text-secondary" />
                  Robótica y Arduino
                </a>
              </li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-secondary">Contacto</h3>
            <div className="space-y-3">
              <p className="text-gray-400">
                📧 <a href="mailto:info@codisea.com" className="hover:text-white transition-colors">info@codisea.com</a>
              </p>
              <p className="text-gray-400">
                📱 <a href="tel:+541123456789" className="hover:text-white transition-colors">+54 11 2345-6789</a>
              </p>
              <p className="text-gray-400">
                🕒 Lunes a Viernes: 9:00 - 18:00
              </p>
              <p className="text-gray-400">
                🕒 Sábados: 9:00 - 13:00
              </p>
            </div>
            
            {/* Botón CTA */}
            <div className="mt-6">
              <Link 
                to="/contacto"
                className="inline-block px-6 py-3 bg-gradient-to-r from-secondary to-complementary text-darkText font-semibold rounded-full hover:from-yellow-500 hover:to-cyan-400 transition-all duration-300 transform hover:scale-105"
              >
                🚀 Clase Gratis
              </Link>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-gray-400">
                © 2025 CODISEA. Todos los derechos reservados.
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm flex items-center">
                Hecho con <FaHeart className="text-red-500 mx-1" /> para los futuros programadores
              </span>
              <Link 
                to="/admin/login" 
                className="text-gray-600 text-xs hover:text-gray-400 transition-colors"
              >
                Administración
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;