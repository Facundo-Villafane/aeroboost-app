import { motion } from 'framer-motion';
import { Link } from 'react-router';
import aboutBgImage from '../assets/about1.png';

const About = () => {
  return (
    <section 
      className="py-16 relative bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: `url(${aboutBgImage})`
      }}
    >
      {/* Overlay para mejorar legibilidad del texto */}
      <div className="absolute inset-0 bg-gray-50/90"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="md:w-2/3 mx-auto">
          <motion.div 
            className="bg-white/90 p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-darkText mb-4">Sobre Nosotros</h2>
            <p className="text-lightText mb-4">
              En AeroBoost Learning Center, somos una empresa especializada en brindar apoyo académico personalizado a estudiantes de carreras aeronáuticas. Nacimos con la visión de transformar la forma en que los futuros profesionales aeronáuticos complementan su formación académica.
            </p>
            <p className="text-lightText mb-6">
              Contamos con un equipo de instructores con amplia experiencia en el sector aeronáutico y metodologías pedagógicas efectivas que garantizan resultados tangibles en el rendimiento académico de nuestros estudiantes.
            </p>
            <Link 
              to="/sobre-nosotros"
              className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition-colors inline-block"
              onClick={() => window.scrollTo(0, 0)}
            >
              Conoce más sobre nosotros
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;