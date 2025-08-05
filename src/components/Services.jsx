import { motion } from 'framer-motion';
import { Link } from 'react-router';
import useCourses from '../hooks/useCourses';
import { FaCode, FaGamepad, FaMobile, FaGlobe, FaRobot, FaPython, FaArrowRight, FaGraduationCap, FaQuestionCircle, FaCubes, FaSpinner, FaBlog } from 'react-icons/fa';

const Services = () => {
  const { courses: fetchedCourses, loading, error } = useCourses({ 
    featuredOnly: true, 
    limit: 3 
  });

  // Solo usar cursos dinámicos de Firebase
  const courses = fetchedCourses;

  const getCourseIcon = (category) => {
    const icons = {
      'roblox': FaCubes,
      'python': FaPython,
      'web': FaGlobe,
      'ai': FaRobot,
      'gamedev': FaGamepad,
      'mobile': FaMobile,
      'programming': FaCode
    };
    
    const IconComponent = icons[category] || FaCode;
    return <IconComponent className="text-6xl text-secondary mb-4" />;
  };

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
      title: "Inteligencia Artificial para Principiantes",
      description: "Descubre el mundo de la IA y Machine Learning de forma accesible",
      icon: <FaRobot className="text-2xl text-secondary" />
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
          <p className="text-xl text-secondary mb-4 font-medium">
            Programas diseñados especialmente para cada edad
          </p>
          <p className="text-complement max-w-3xl mx-auto leading-relaxed">
            Desde crear mundos en Roblox hasta el desarrollo de aplicaciones reales, 
            tenemos el curso perfecto para cada nivel de experiencia y edad.
          </p>
        </motion.div>

        {/* Cursos principales */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-primary mb-4 mx-auto" />
              <p className="text-complement text-lg">Cargando cursos...</p>
            </div>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                className="bg-complement rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 group flex flex-col h-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-center mb-6">
                  {getCourseIcon(course.category)}
                  <h3 className="text-xl font-bold text-primary mb-3 brand-font">
                    {course.title}
                  </h3>
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
                  {course.shortDescription || course.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Edad:</span>
                    <span className="text-sm font-bold text-primary">{course.ageRange}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Duración:</span>
                    <span className="text-sm font-bold text-primary">{course.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Nivel:</span>
                    <span className="text-sm font-bold text-primary">{course.level}</span>
                  </div>
                  {course.price && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Precio:</span>
                      <span className="text-lg font-bold text-green-600">
                        ${course.price.toLocaleString('es-AR')}
                      </span>
                    </div>
                  )}
                </div>
                
                <Link
                  to={`/servicios#${course.id}`}
                  className="w-full bg-primary text-complement py-3 px-6 rounded-full font-semibold transition-all duration-300 hover:bg-accent hover:shadow-lg group-hover:transform group-hover:scale-105 flex items-center justify-center gap-2 mt-auto"
                >
                  Más información
                  <FaArrowRight className="text-sm" />
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <motion.div
                className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-6"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <FaCode className="text-4xl text-primary" />
              </motion.div>
              <h3 className="text-3xl font-bold text-complement mb-4 brand-font">
                ¡Cursos en Desarrollo!
              </h3>
              <p className="text-complement max-w-2xl mx-auto leading-relaxed text-lg">
                Nuestro equipo está diseñando experiencias de aprendizaje increíbles. 
                Pronto tendremos cursos de programación que transformarán la forma en que los jóvenes aprenden tecnología.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
              <motion.div 
                className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-2xl border border-primary/20"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <FaCubes className="text-3xl text-primary mx-auto mb-3" />
                <h4 className="font-bold text-complement mb-2">Roblox Studio</h4>
                <p className="text-sm text-complement/80">Creación de mundos virtuales</p>
              </motion.div>
              <motion.div 
                className="bg-gradient-to-br from-secondary/10 to-primary/10 p-6 rounded-2xl border border-secondary/20"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <FaPython className="text-3xl text-secondary mx-auto mb-3" />
                <h4 className="font-bold text-complement mb-2">Python</h4>
                <p className="text-sm text-complement/80">Programación desde cero</p>
              </motion.div>
              <motion.div 
                className="bg-gradient-to-br from-accent/10 to-secondary/10 p-6 rounded-2xl border border-accent/20"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <FaGlobe className="text-3xl text-accent mx-auto mb-3" />
                <h4 className="font-bold text-complement mb-2">Desarrollo Web</h4>
                <p className="text-sm text-complement/80">Sitios web modernos</p>
              </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contacto"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-complement font-bold rounded-2xl hover:bg-accent transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <FaGraduationCap />
                Consultar Disponibilidad
              </Link>
              <Link 
                to="/blog"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-outline font-semibold rounded-2xl hover:bg-accent hover:text-complement transition-all duration-300 transform hover:scale-105"
              >
                <FaBlog />
                Seguir Nuestro Blog
              </Link>
            </div>
          </motion.div>
        )}

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
            <p className="text-complement mb-6 text-lg">
              Únete a cientos de estudiantes que ya están creando el futuro
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