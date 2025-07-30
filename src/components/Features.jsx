import { FaBrain, FaUsers, FaLaptop, FaTrophy, FaHeart, FaRocket, FaGlobe } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      icon: <FaBrain className="text-4xl text-secondary mb-4" />,
      title: "Pensamiento Lógico",
      description: "Desarrollamos habilidades de resolución de problemas y pensamiento crítico a través de la programación."
    },
    {
      icon: <FaUsers className="text-4xl text-secondary mb-4" />,
      title: "Clases Interactivas",
      description: "Grupos pequeños con instructor dedicado, donde cada estudiante recibe atención personalizada."
    },
    {
      icon: <FaLaptop className="text-4xl text-secondary mb-4" />,
      title: "Proyectos Reales",
      description: "Los estudiantes crean videojuegos, aplicaciones web y proyectos que pueden mostrar a familia y amigos."
    },
    {
      icon: <FaTrophy className="text-4xl text-secondary mb-4" />,
      title: "Metodología Gamificada",
      description: "Aprendizaje divertido con desafíos, logros y recompensas que mantienen a los jóvenes motivados."
    }
  ];

  return (
    <section className="py-16 bg-complement">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-primary mb-4 brand-font">
            ¿Por qué elegir CODISEA?
          </h2>
          <p className="text-xl text-outline mb-2">
            Una experiencia de aprendizaje única
          </p>
          <p className="text-lightText max-w-2xl mx-auto">
            Combinamos diversión, creatividad y tecnología para que niños y jóvenes 
            descubran su potencial en el mundo digital
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-complement p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 border-l-4 border-secondary hover:border-accent"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-lightText leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Sección adicional de beneficios */}
        <motion.div 
          className="mt-16 bg-gradient-to-r from-primary to-outline p-8 rounded-2xl text-complement text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaRocket className="text-2xl text-secondary" />
            <h3 className="text-2xl font-bold brand-font">
              Beneficios únicos de aprender con nosotros
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-complement/10 p-4 rounded-xl backdrop-blur-sm hover:bg-complement/20 transition-all duration-300">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FaTrophy className="text-secondary" />
                <h4 className="font-semibold text-complement">Aprendizaje Divertido</h4>
              </div>
              <p className="text-sm text-secondary-2">
                Convertimos la programación en un juego emocionante
              </p>
            </div>
            <div className="bg-complement/10 p-4 rounded-xl backdrop-blur-sm hover:bg-complement/20 transition-all duration-300">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FaGlobe className="text-secondary" />
                <h4 className="font-semibold text-complement">Habilidades del Futuro</h4>
              </div>
              <p className="text-sm text-secondary-2">
                Preparamos a los jóvenes para las carreras del mañana
              </p>
            </div>
            <div className="bg-complement/10 p-4 rounded-xl backdrop-blur-sm hover:bg-complement/20 transition-all duration-300">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FaUsers className="text-secondary" />
                <h4 className="font-semibold text-complement">Comunidad Activa</h4>
              </div>
              <p className="text-sm text-secondary-2">
                Conectamos estudiantes para compartir proyectos
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;