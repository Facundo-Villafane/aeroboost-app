import { FaClock, FaUserFriends, FaLaptop, FaClipboardCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      icon: <FaClock className="text-4xl text-primary mb-4" />,
      title: "Horarios Flexibles",
      description: "Clases virtuales sincrónicas adaptadas a tu disponibilidad horaria."
    },
    {
      icon: <FaUserFriends className="text-4xl text-primary mb-4" />,
      title: "Atención Personalizada",
      description: "Tutorías individuales o en grupos reducidos para un aprendizaje efectivo."
    },
    {
      icon: <FaLaptop className="text-4xl text-primary mb-4" />,
      title: "Aula Virtual",
      description: "Plataforma de aprendizaje con recursos educativos completos y simuladores de exámenes."
    },
    {
      icon: <FaClipboardCheck className="text-4xl text-primary mb-4" />,
      title: "Metodología Efectiva",
      description: "Enfoque práctico orientado a la aprobación de exámenes y comprensión profunda de conceptos."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-darkText mb-2">¿Por qué elegirnos?</h2>
          <p className="text-lightText">Apoyo académico adaptado a tus necesidades</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-lightText">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;