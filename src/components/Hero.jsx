import { motion } from 'framer-motion';
import { Link } from 'react-router';
import imgFondo from '../assets/hero-image.jpg'; // Ajusta la ruta según la ubicación de tu imagen

const Hero = () => {
  return (
    <div 
      className="relative bg-primary text-white py-24 bg-cover bg-center"
      style={{ 
        backgroundImage: `url(${imgFondo})`,
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Overlay de gradiente para mejorar legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-blue-800/70"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Potencia tu formación con apoyo académico especializado
          </h1>
          <p className="text-xl mb-8">
            En AeroBoost Learning Center te ayudamos a superar los desafíos académicos de tu carrera con tutorías personalizadas, 
            material exclusivo y un entorno virtual diseñado para vos.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              to="/servicios" 
              className="px-6 py-3 bg-white text-primary font-semibold rounded-md hover:bg-gray-100 transition-colors"
            >
              Nuestros Servicios
            </Link>
            <Link 
              to="/contacto" 
              className="px-6 py-3 border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-primary transition-colors"
            >
              Contáctanos
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;