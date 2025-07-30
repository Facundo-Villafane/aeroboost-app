import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FaCode, FaGamepad, FaMobile, FaGlobe, FaPalette, FaPython, FaArrowRight, FaGraduationCap, FaQuestionCircle, FaCubes } from 'react-icons/fa';

const Services = () => {
  const services = [
    {
      title: "Roblox Studio para Principiantes",
      description: "Crea tus propios mundos y videojuegos en Roblox usando Lua. Perfecto para niños de 8-12 años que quieren dar vida a su creatividad.",
      icon: <FaCubes className="text-6xl text-secondary mb-4" />,
      id: "roblox-principiantes",
      ageRange: "8-12 años",
      duration: "10 semanas",
      level: "Principiante"
    },
    {
      title: "Python para Niños y Jóvenes",
      description: "Aprende Python desde cero, uno de los lenguajes más populares. Desde conceptos básicos hasta proyectos avanzados con inteligencia artificial.",
      icon: <FaPython className="text-6xl text-secondary mb-4" />,
      id: "python-completo",
      ageRange: "10-17 años",
      duration: "14 semanas",
      level: "Principiante a Avanzado"
    },
    {
      title: "Desarrollo Web Juvenil",
      description: "Crea sitios web increíbles con HTML, CSS y JavaScript. Aprende a diseñar y programar páginas web profesionales y responsivas.",
      icon: <FaGlobe className="text-6xl text-secondary mb-4" />,
      id: "desarrollo-web",
      ageRange: "14-17 años",
      duration: "16 semanas",
      level: "Intermedio"
    }
  ];

  const extraCourses = [
    {
      title: "Construct 3",
      description: "Crea videojuegos sin programar usando Construct 3",
      icon: <FaGamepad className="text-2xl text-secondary" />
    },
    {
      title: "Videojuegos Móviles",
      description: "Desarrolla juegos para Android e iOS",
      icon: <FaMobile className="text-2xl text-secondary" />
    },
    {
      title: "Game Design Avanzado",
      description: "Diseña y crea videojuegos completos con Unity",
      icon: <FaPalette className="text-2xl text-secondary" />
    }
  ];

  return (
    <section className="py-16 bg-outline">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-complement mb-4 brand-font">
            Nuestros Cursos
          </h2>
          <p className="text-xl text-secondary-2 mb-4">
            Programas diseñados especialmente para cada edad
          </p>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Desde crear mundos en Roblox hasta el desarrollo de aplicaciones reales, 
            tenemos el curso perfecto para cada joven programador
          </p>
        </motion.div>
        
        {/* Cursos principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              className="bg-complement rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-secondary flex flex-col h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="p-8 text-center flex flex-col flex-grow">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="mb-4"
                >
                  {service.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-primary mb-3">
                  {service.title}
                </h3>
                <p className="text-lightText mb-6 leading-relaxed flex-grow">
                  {service.description}
                </p>
                
                {/* Información del curso */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-primary">Edades:</span>
                    <span className="px-3 py-1 bg-secondary/20 text-primary rounded-full text-sm font-semibold border border-secondary">
                      {service.ageRange}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-primary">Duración:</span>
                    <span className="text-sm text-outline">{service.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-primary">Nivel:</span>
                    <span className="text-sm text-outline">{service.level}</span>
                  </div>
                </div>
                
                {/* Botón siempre al final */}
                <div className="mt-auto">
                  <Link 
                    to={`/servicios#${service.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-complement font-semibold rounded-full hover:bg-accent transition-all duration-300 transform hover:scale-105"
                  >
                    Ver Detalles <FaArrowRight />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Cursos adicionales */}
        <motion.div 
          className="bg-gradient-to-r from-primary to-primary p-8 rounded-2xl text-complement"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <FaCode className="text-2xl text-secondary" />
            <h3 className="text-2xl font-bold brand-font">
              También Ofrecemos
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {extraCourses.map((course, index) => (
              <div 
                key={index} 
                className="bg-complement/10 p-6 rounded-xl backdrop-blur-sm hover:bg-complement/20 transition-all duration-300"
              >
                <div className="flex items-center mb-3">
                  {course.icon}
                  <h4 className="font-semibold ml-3 text-complement">{course.title}</h4>
                </div>
                <p className="text-sm text-complement/90">{course.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FaQuestionCircle className="text-secondary" />
              <p className="text-lg font-medium text-complement">
                ¿No encuentras lo que buscas?
              </p>
            </div>
            <Link 
              to="/contacto"
              className="inline-flex items-center gap-2 px-8 py-3 bg-secondary text-outline font-semibold rounded-full hover:bg-accent hover:text-complement transition-all duration-300 transform hover:scale-105"
            >
              <FaGraduationCap />
              Consulta por Cursos Personalizados
            </Link>
          </div>
        </motion.div>
        
        {/* Call to action final */}
        <div className="text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-complement mb-4 brand-font">
              ¿Listo para empezar a programar?
            </h3>
            <p className="text-secondary-2 mb-6">
              Únete a cientos de jóvenes que ya están creando el futuro
            </p>
            <Link 
              to="/servicios"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-complement font-semibold rounded-full hover:bg-accent transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FaCode />
              Ver Todos los Cursos
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Services;