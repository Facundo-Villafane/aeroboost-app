import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { 
  FaCode, 
  FaGraduationCap, 
  FaUsers, 
  FaLaptop, 
  FaRocket, 
  FaStar, 
  FaTrophy, 
  FaGamepad,
  FaBrain,
  FaHeart
} from 'react-icons/fa';

const About = () => {
  const features = [
    {
      icon: <FaGraduationCap className="text-4xl text-secondary mb-4" />,
      title: "Metodología Única",
      description: "Nuestro enfoque combina teoría y práctica de manera equilibrada, adaptándose al ritmo de aprendizaje de cada estudiante."
    },
    {
      icon: <FaUsers className="text-4xl text-secondary mb-4" />,
      title: "Grupos Reducidos",
      description: "Clases con máximo 8 estudiantes para garantizar atención personalizada y un seguimiento individualizado del progreso."
    },
    {
      icon: <FaLaptop className="text-4xl text-secondary mb-4" />,
      title: "Tecnología Actual",
      description: "Trabajamos con las herramientas y lenguajes más actuales de la industria tecnológica para preparar a los estudiantes para el futuro."
    },
    {
      icon: <FaGamepad className="text-4xl text-secondary mb-4" />,
      title: "Aprendizaje Divertido",
      description: "Transformamos la programación en una experiencia divertida a través de proyectos de videojuegos, aplicaciones y desafíos interactivos."
    }
  ];

  return (
    <section className="py-16 bg-complement">
      <div className="container mx-auto px-4">
        {/* Cabecera principal */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-primary mb-4 brand-font">
            ¿Por qué elegir CODISEA?
          </h2>
          <p className="text-xl text-gray-700 mb-6 font-medium">
            Formamos a los programadores del futuro con metodologías innovadoras
          </p>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            En CODISEA creemos que la programación es una herramienta poderosa que abre puertas 
            infinitas de creatividad y oportunidades. Nuestro enfoque pedagógico está diseñado 
            para hacer que el aprendizaje sea accesible, divertido y efectivo.
          </p>
        </motion.div>

        {/* Grid de características */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border-l-4 border-secondary"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-primary mb-3 brand-font">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Sección de valores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenido textual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-primary mb-6 brand-font">
              Nuestra Misión
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Democratizar el acceso a la educación en tecnología y programación, 
              brindando herramientas y conocimientos que permitan a cada estudiante 
              desarrollar su máximo potencial creativo y profesional.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <FaBrain className="text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-primary mb-1">Desarrollo del Pensamiento Lógico</h4>
                  <p className="text-gray-600 text-sm">Fortalecemos habilidades de resolución de problemas y pensamiento crítico.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaHeart className="text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-primary mb-1">Pasión por la Tecnología</h4>
                  <p className="text-gray-600 text-sm">Cultivamos el amor por la programación y la innovación tecnológica.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaTrophy className="text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-primary mb-1">Excelencia Educativa</h4>
                  <p className="text-gray-600 text-sm">Mantenemos los más altos estándares de calidad en nuestros programas.</p>
                </div>
              </div>
            </div>

            <Link 
              to="/sobre-nosotros"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-complement font-semibold rounded-full hover:bg-accent transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => window.scrollTo(0, 0)}
            >
              <FaRocket />
              Conoce más sobre nosotros
            </Link>
          </motion.div>

          {/* Estadísticas visuales */}
          <motion.div
            className="bg-gradient-to-br from-primary via-primary to-accent p-8 rounded-2xl text-complement"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold mb-6 brand-font text-center">
              Resultados que nos enorgullecen
            </h3>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">500+</div>
                <div className="text-sm text-complement/90">Estudiantes graduados</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">95%</div>
                <div className="text-sm text-complement/90">Satisfacción familiar</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">4.9</div>
                <div className="text-sm text-complement/90">Calificación promedio</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">50+</div>
                <div className="text-sm text-complement/90">Proyectos creados</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaStar className="text-secondary flex-shrink-0" />
                <span className="text-complement text-sm"><strong>Metodología Probada:</strong> Técnicas de enseñanza validadas por expertos en educación</span>
              </div>
              <div className="flex items-center gap-3">
                <FaStar className="text-secondary flex-shrink-0" />
                <span className="text-complement text-sm"><strong>Tecnología Actual:</strong> Herramientas de vanguardia y metodologías de élite</span>
              </div>
              <div className="flex items-center gap-3">
                <FaStar className="text-secondary flex-shrink-0" />
                <span className="text-complement text-sm"><strong>Transformación Total:</strong> De principiante a creador de tecnología en tiempo récord</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="bg-gradient-to-r from-secondary to-secondary p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold mb-4 text-outline brand-font">¿Listo para desbloquear tu potencial?</h3>
            <p className="text-lg mb-6 text-outline/90">
              Únete a la revolución educativa que está creando a los próximos genios tecnológicos
            </p>
            <Link 
              to="/servicios"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-complement font-semibold rounded-full hover:bg-accent transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => window.scrollTo(0, 0)}
            >
              <FaRocket />
              Inscríbete Ahora
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;