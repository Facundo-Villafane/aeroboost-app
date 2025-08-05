import { FaBrain, FaUsers, FaLaptop, FaTrophy, FaHeart, FaRocket, FaGlobe, FaCode, FaGamepad, FaCertificate } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      icon: <FaBrain />,
      title: "Pensamiento Lógico",
      description: "Desarrollamos habilidades de resolución de problemas y pensamiento crítico a través de la programación.",
      color: "bg-gradient-primary",
      highlight: "Razonamiento"
    },
    {
      icon: <FaUsers />,
      title: "Clases Personalizadas",
      description: "Grupos pequeños de máximo 8 estudiantes con instructor dedicado y atención personalizada.",
      color: "bg-gradient-accent",
      highlight: "Max 8 estudiantes"
    },
    {
      icon: <FaGamepad />,
      title: "Proyectos Increíbles",
      description: "Crea videojuegos, aplicaciones web y proyectos que puedes mostrar con orgullo a tu familia.",
      color: "bg-gradient-warm",
      highlight: "Portafolio real"
    },
    {
      icon: <FaTrophy />,
      title: "Gamificación Total",
      description: "Sistema de logros, desafíos y recompensas que hacen del aprendizaje una aventura emocionante.",
      color: "bg-success",
      highlight: "100% divertido"
    },
    {
      icon: <FaCode />,
      title: "Tecnologías Actuales",
      description: "Aprende con las herramientas y lenguajes que usan los profesionales de la industria tech.",
      color: "bg-primary",
      highlight: "Stack moderno"
    },
    {
      icon: <FaCertificate />,
      title: "Certificación de Logros",
      description: "Obtén certificados que validen tus habilidades y progreso en programación.",
      color: "bg-accent",
      highlight: "Certificado"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-6 py-2 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <FaRocket className="text-sm" />
            <span className="font-semibold text-sm">¿Por qué somos diferentes?</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 brand-font leading-tight">
            La metodología que{' '}
            <span className="text-accent">transforma</span>{' '}
            el aprendizaje
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            No solo enseñamos código, creamos experiencias que despiertan la pasión por la tecnología 
            y preparan a los jóvenes para el futuro digital
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="group relative card-modern p-8 text-center overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              {/* Background gradient overlay */}
              <div className={`absolute inset-0 ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Highlight badge */}
              <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-semibold mb-6">
                <div className={`w-2 h-2 ${feature.color} rounded-full`}></div>
                {feature.highlight}
              </div>
              
              {/* Icon */}
              <motion.div
                className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} text-white rounded-2xl mb-6 relative z-10`}
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="text-2xl">
                  {feature.icon}
                </div>
              </motion.div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
              
              {/* Hover effect border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-2xl transition-colors duration-300"></div>
            </motion.div>
          ))}
        </div>
        
        {/* Call to Action moderna */}
        <motion.div 
          className="mt-20 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-12 rounded-3xl text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <motion.div
                className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <FaHeart className="text-white" />
                <span className="font-semibold text-sm">¡Únete a nuestra familia!</span>
              </motion.div>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-4 brand-font">
                ¿Listo para comenzar tu aventura tecnológica?
              </h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Más de 500 estudiantes ya han comenzado su viaje. 
                Tu futuro en tecnología comienza con el primer paso.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a 
                  href="/servicios"
                  className="btn-modern bg-white text-primary px-8 py-4 font-bold rounded-2xl hover:bg-gray-100 flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaRocket />
                  Ver Cursos Disponibles
                </motion.a>
                <motion.a 
                  href="/contacto"
                  className="btn-modern bg-transparent border-2 border-white text-white px-8 py-4 font-semibold rounded-2xl hover:bg-white hover:text-primary flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUsers />
                  Hablar con Nosotros
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;