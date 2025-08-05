import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FaCode, FaRocket, FaGamepad, FaClock, FaUsers, FaGraduationCap, FaLaptop, FaStar, FaPlay } from 'react-icons/fa';

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
      {/* Geometric background patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-primary rounded-full opacity-20 blur-xl animate-pulse-glow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-accent rounded-full opacity-30 blur-lg"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-warm rounded-full opacity-15 blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-primary rounded-full opacity-25 blur-xl"></div>
      </div>

      {/* Floating code elements - modernized */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 text-white text-2xl font-mono font-bold opacity-40"
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          {'<Code />'}
        </motion.div>
        <motion.div
          className="absolute top-32 right-20 text-yellow-300 text-lg font-mono opacity-35"
          animate={{ y: [0, 20, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        >
          const learn = () => {}
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-20 text-cyan-300 text-xl font-mono opacity-40"
          animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, delay: 0.5 }}
        >
          {'{ dream: true }'}
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-32 text-white text-lg font-mono opacity-30"
          animate={{ y: [0, 25, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 9, repeat: Infinity, delay: 2 }}
        >
          while (coding) 🚀
        </motion.div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 flex items-center min-h-screen">
        <motion.div 
          className="max-w-5xl mx-auto text-center py-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge superior */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <FaStar className="text-yellow-500 text-sm" />
            <span className="text-sm font-semibold text-gray-800">La mejor academia de programación para jóvenes</span>
            <FaStar className="text-yellow-500 text-sm" />
          </motion.div>

          {/* Logo/Título principal modernizado */}
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-8 brand-font text-white drop-shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            CODISEA
          </motion.h1>

          {/* Subtítulo moderno */}
          <motion.h2 
            className="text-2xl md:text-4xl mb-8 text-white font-medium leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transforma tu{' '}
            <span className="text-yellow-300 font-bold">pasión por la tecnología</span>
            <br />
            en tu superpoder del futuro
          </motion.h2>

          {/* Descripción principal mejorada */}
          <motion.p 
            className="text-lg md:text-xl mb-12 text-white/90 leading-relaxed max-w-4xl mx-auto drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Desde crear videojuegos increíbles hasta desarrollar aplicaciones web profesionales, 
            nuestros cursos están diseñados para estudiantes de 8 a 17 años que sueñan en grande. 
            <span className="font-semibold text-cyan-300">¡Sin experiencia previa necesaria!</span>
          </motion.p>

          {/* Estadísticas modernizadas */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-white/80 font-medium">Estudiantes felices</div>
              <FaUsers className="text-cyan-300 text-2xl mx-auto mt-3" />
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="text-4xl font-bold text-white mb-2">15+</div>
              <div className="text-white/80 font-medium">Cursos especializados</div>
              <FaCode className="text-yellow-300 text-2xl mx-auto mt-3" />
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-white/80 font-medium">Tasa de satisfacción</div>
              <FaStar className="text-yellow-400 text-2xl mx-auto mt-3" />
            </div>
          </motion.div>

          {/* Botones de acción modernizados */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <Link 
              to="/servicios" 
              className="bg-white text-blue-600 px-10 py-4 font-bold rounded-2xl flex items-center gap-3 text-lg group hover:bg-blue-50 transition-all shadow-xl border-2 border-white"
            >
              <FaRocket className="group-hover:animate-bounce" />
              Explorar Cursos
            </Link>
            <button className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 font-semibold rounded-2xl flex items-center gap-3 hover:bg-white hover:text-blue-600 transition-all shadow-xl">
              <FaPlay />
              Ver Demo
            </button>
          </motion.div>

          {/* Información adicional modernizada */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 shadow-lg">
              <FaUsers className="text-cyan-300" />
              <span className="text-white font-semibold">8 a 17 años</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 shadow-lg">
              <FaLaptop className="text-yellow-300" />
              <span className="text-white font-semibold">100% Online</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 shadow-lg">
              <FaGraduationCap className="text-green-300" />
              <span className="text-white font-semibold">Certificaciones</span>
            </div>
          </motion.div>

          {/* Enlace al aula virtual destacado */}
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <a 
              href="https://aula.codisea.dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white hover:text-yellow-300 transition-colors font-semibold underline decoration-2 underline-offset-4"
            >
              <FaGraduationCap />
              Acceder al Aula Virtual
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;