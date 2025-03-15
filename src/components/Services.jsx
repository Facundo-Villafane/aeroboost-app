
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import clase1 from '../assets/clases1.jpg';
import clase2 from '../assets/clases2.jpg';
import clase3 from '../assets/clases3.jpg';

const Services = () => {
  const services = [
    {
      title: "Clases Particulares",
      description: "Sesiones personalizadas con instructores especializados para reforzar materias específicas de tu carrera aeronáutica.",
      image: clase3,
      id: "clases-particulares"
    },
    {
      title: "Preparación para Exámenes",
      description: "Programas intensivos de repaso y simulacros para ayudarte a superar con éxito tus evaluaciones oficiales.",
      image: clase2,
      id: "preparación-para-exámenes"
    },
    {
      title: "Nivelación Académica",
      description: "Sesiones enfocadas en cubrir brechas de conocimiento y fortalecer áreas específicas de tu formación aeronáutica.",
      image: clase1,
      id: "nivelación-académica"
    }
  ];

  const targetAreas = [
    "Piloto Comercial",
    "Tripulante de Cabina",
    "Despachante de Aeronaves",
    "Controlador de Tránsito Aéreo",
    "Gestión Aeroportuaria",
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-darkText mb-2">Nuestros Servicios</h2>
          <p className="text-lightText mb-4">Apoyo académico especializado para estudiantes de carreras aeronáuticas</p>
          <p className="text-gray-600 max-w-3xl mx-auto">
            En AeroBoost Learning Center nos enfocamos en ayudarte a superar los desafíos de tu formación
            aeronáutica, ofreciendo servicios personalizados que complementan tu educación principal.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md h-full flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-lightText mb-4">{service.description}</p>
                <Link 
                  to={`/servicios#${service.id}`}
                  className="text-primary font-medium hover:underline mt-auto inline-block"
                >
                  Más información →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 bg-gray-50 p-8 rounded-lg shadow-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-2xl font-semibold text-center mb-6">Áreas que cubrimos</h3>
          <p className="text-center text-gray-600 mb-8">
            Ofrecemos apoyo académico para estudiantes de diversas carreras aeronáuticas:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {targetAreas.map((area, index) => (
              <div 
                key={index} 
                className="bg-white p-4 rounded-lg shadow-sm text-center border-l-4 border-primary"
              >
                <h4 className="font-medium">{area}</h4>
              </div>
            ))}
          </div>
        </motion.div>
        
        <div className="text-center mt-12">
          <Link 
            to="/servicios"
            className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            Ver todos nuestros servicios
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;