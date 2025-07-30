import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FaCode, FaRocket, FaGamepad, FaClock, FaUsers, FaGraduationCap, FaLaptop } from 'react-icons/fa';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-primary via-primary to-outline text-complement py-24 overflow-hidden">
      {/* Overlay sutil para mejorar legibilidad */}
      <div className="absolute inset-0 bg-primary/90"></div>
      
      {/* Elementos flotantes de código */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 text-secondary text-2xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {'</>'}
        </motion.div>
        <motion.div
          className="absolute top-32 right-20 text-secondary text-lg"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >
          function()
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-20 text-secondary text-xl"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
        >
          {'{ }'}
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-32 text-secondary text-lg"
          animate={{ y: [0, 25, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, delay: 2 }}
        >
          if (true)
        </motion.div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo/Título principal */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 brand-font"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="text-secondary">COD</span>
            <span className="text-complement">I</span>
            <span className="text-secondary">SEA</span>
          </motion.h1>
          
          {/* Subtítulo con animación de typing */}
          <motion.div
            className="text-xl md:text-2xl mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <span className="typing-animation">
              Programación para Niños y Jóvenes
            </span>
          </motion.div>
          
          <motion.p 
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed text-secondary-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            Descubre el emocionante mundo de la programación de forma divertida y creativa. 
            Aprende a crear videojuegos, aplicaciones y sitios web mientras desarrollas 
            pensamiento lógico y habilidades del futuro.
          </motion.p>

          {/* Iconos de características */}
          <motion.div 
            className="flex justify-center gap-8 mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <div className="flex flex-col items-center">
              <FaCode className="text-4xl text-secondary mb-2" />
              <span className="text-sm text-complement">Aprende Coding</span>
            </div>
            <div className="flex flex-col items-center">
              <FaGamepad className="text-4xl text-secondary mb-2" />
              <span className="text-sm text-complement">Crea Juegos</span>
            </div>
            <div className="flex flex-col items-center">
              <FaRocket className="text-4xl text-secondary mb-2" />
              <span className="text-sm text-complement">Proyectos Reales</span>
            </div>
          </motion.div>
          
          {/* Botones de acción */}
          <motion.div 
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <Link 
              to="/servicios" 
              className="px-8 py-4 bg-secondary text-outline font-semibold rounded-full hover:bg-accent hover:text-complement transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <FaRocket />
              Explorar Cursos
            </Link>
            <a 
              href="https://aula.codisea.dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-complement text-primary font-semibold rounded-full hover:bg-secondary-2 hover:text-outline transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
            >
              <FaGraduationCap />
              Acceder al Aula Virtual
            </a>
          </motion.div>

          {/* Información adicional */}
          <motion.div 
            className="flex justify-center gap-6 mt-8 text-sm opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <div className="flex items-center gap-2">
              <FaUsers className="text-secondary" />
              <span className="text-complement">8 a 17 años</span>
            </div>
            <div className="flex items-center gap-2">
              <FaLaptop className="text-secondary" />
              <span className="text-complement">Clases Online</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCode className="text-secondary" />
              <span className="text-complement">Sin experiencia previa</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;