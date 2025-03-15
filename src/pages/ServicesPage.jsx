
import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router';
import { FaGraduationCap, FaBook, FaChalkboardTeacher, FaUsers, FaRegClock, FaLaptop } from 'react-icons/fa';

const ServicesPage = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(null);
  
  // Detectar si hay un hash en la URL para hacer scroll a esa sección o al principio si no hay hash
  useEffect(() => {
    if (location.hash) {
      // Si hay un hash, scroll a esa sección específica
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(id);
        }, 100);
      }
    } else {
      // Si no hay hash, scroll al principio de la página
      window.scrollTo(0, 0);
    }
  }, [location]);

  const mainServices = [
    {
      id: "clases-particulares",
      title: "Clases Particulares",
      icon: <FaChalkboardTeacher className="text-5xl text-primary mb-4" />,
      description: "Nuestras sesiones de enseñanza individualizadas están diseñadas para abordar tus necesidades específicas. Trabajamos con instructores especializados en cada área de la formación aeronáutica que adaptan el contenido y ritmo de aprendizaje según tus requerimientos.",
      benefits: [
        "Atención personalizada que se adapta a tu estilo de aprendizaje",
        "Flexibilidad horaria para ajustarse a tu agenda",
        "Posibilidad de enfocarse en temas específicos que presenten dificultad",
        "Progreso acelerado gracias a la atención individualizada"
      ],
      methodologies: "Utilizamos metodologías interactivas con materiales didácticos especializados, ejemplos prácticos y ejercicios adaptados a tu nivel de conocimiento. Las sesiones son virtuales con horarios flexibles."
    },
    {
      id: "preparación-para-exámenes",
      title: "Preparación para Exámenes",
      icon: <FaBook className="text-5xl text-primary mb-4" />,
      description: "Nuestros programas de preparación para exámenes te ayudan a afrontar con confianza las evaluaciones oficiales. Desarrollamos planes de estudio específicos para cada tipo de examen, con simulacros que replican las condiciones reales de evaluación.",
      benefits: [
        "Identificación y refuerzo de áreas de mejora",
        "Familiarización con el formato y tipo de preguntas del examen",
        "Reducción de la ansiedad ante la evaluación",
        "Estrategias específicas para maximizar tu puntuación"
      ],
      methodologies: "Trabajamos con materiales actualizados según los estándares de los organismos evaluadores, realizamos simulacros cronometrados y ofrecemos retroalimentación detallada que te permite mejorar progresivamente."
    },
    {
      id: "nivelación-académica",
      title: "Nivelación Académica",
      icon: <FaGraduationCap className="text-5xl text-primary mb-4" />,
      description: "Nuestros programas de nivelación están diseñados para estudiantes que necesitan reforzar conocimientos fundamentales para avanzar en su formación aeronáutica. Identificamos brechas de conocimiento y desarrollamos planes personalizados para superarlas.",
      benefits: [
        "Fortalecimiento de conceptos básicos necesarios para materias avanzadas",
        "Recuperación del ritmo académico tras ausencias o cambios de institución",
        "Adaptación a diferentes metodologías de enseñanza",
        "Aumento de la confianza en tus capacidades académicas"
      ],
      methodologies: "Realizamos evaluaciones diagnósticas para identificar áreas de mejora, establecemos objetivos claros y medibles, y diseñamos un plan progresivo que te permite avanzar desde lo fundamental hasta lo más complejo."
    }
  ];

  const additionalServices = [
    {
      title: "Grupos de Estudio",
      icon: <FaUsers className="text-3xl text-primary mb-3" />,
      description: "Sesiones colaborativas con pequeños grupos de estudiantes que comparten intereses o desafíos similares. El aprendizaje entre pares potencia la comprensión y retención de conocimientos."
    },
    {
      title: "Cursos Intensivos",
      icon: <FaRegClock className="text-3xl text-primary mb-3" />,
      description: "Programas concentrados diseñados para abordar temas específicos en periodos cortos de tiempo. Ideales para periodos previos a exámenes o para reforzar áreas concretas."
    },
    {
      title: "Tutorías Online",
      icon: <FaLaptop className="text-3xl text-primary mb-3" />,
      description: "Sesiones de aprendizaje a distancia que te permiten acceder a nuestros servicios desde cualquier lugar. Utilizamos plataformas interactivas que facilitan la comunicación y el intercambio de materiales."
    }
  ];

  const targetAreas = [
    {
      title: "Piloto Comercial",
      subjects: ["Meteorología", "Navegación", "Sistemas de Aeronaves", "Factores Humanos", "Aerodinámica", "Reglamentación Aérea"]
    },
    {
      title: "Gestión Aeroportuaria",
      subjects: ["Seguridad Aeronáutica y Operacional", "Regulación Jurídica de la Aviación Comercial", "Marketing y Comunicación", "Gestión de Aeropuertos y Aerolíneas", "Sistemas de reservas", "Estadística"]
    },
    {
      title: "Tripulante de Cabina",
      subjects: ["Seguridad Aérea", "Primeros Auxilios", "Procedimientos de Emergencia", "Servicio a Bordo", "Factores Humanos", "Mercancías Peligrosas"]
    },
    {
      title: "Despachante de Aeronaves",
      subjects: ["Planificación de Vuelo", "Meteorología", "Navegación", "Peso y Balance", "Reglamentación", "Performance de Aeronaves"]
    },
    {
      title: "Controlador de Tránsito Aéreo",
      subjects: ["Procedimientos ATC", "Fraseología Aeronáutica", "Regulaciones Aéreas", "Sistemas de Navegación", "Aeródromos", "Espacio Aéreo"]
    }
  ];

  return (
    <div className="py-16">
      <Helmet>
        <title>Servicios Educativos Aeronáuticos | AeroBoost Learning Center</title>
        <meta 
          name="description" 
          content="Descubre nuestros servicios de apoyo académico especializado para estudiantes de carreras aeronáuticas: clases particulares, preparación para exámenes y nivelación académica."
        />
        <meta 
          name="keywords" 
          content="apoyo académico aeronáutico, clases particulares aviación, preparación exámenes piloto, nivelación meteorología, formación aeronáutica"
        />
      </Helmet>
      <div className="container mx-auto px-4">
        {/* Hero section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Servicios Educativos Especializados</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            En AeroBoost Learning Center nos dedicamos a potenciar tu formación aeronáutica 
            con servicios académicos personalizados que te ayudan a alcanzar tus objetivos profesionales.
          </p>
        </motion.div>

        {/* Navigation buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {mainServices.map((service, index) => (
            <button
              key={index}
              onClick={() => {
                document.getElementById(service.id).scrollIntoView({ behavior: 'smooth' });
                setActiveSection(service.id);
              }}
              className={`px-6 py-3 rounded-md transition-colors ${
                activeSection === service.id 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {service.title}
            </button>
          ))}
        </motion.div>

        {/* Main services with detailed descriptions */}
        <div className="space-y-24 mb-20">
          {mainServices.map((service, index) => (
            <motion.div 
              key={index}
              id={service.id}
              className="scroll-mt-24"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex flex-col items-center md:flex-row md:items-start">
                  <div className="md:mr-8 flex-shrink-0 flex justify-center">
                    {service.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h2>
                    <p className="text-gray-700 mb-6">{service.description}</p>
                    
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Beneficios</h3>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                      {service.benefits.map((benefit, i) => (
                        <li key={i} className="text-gray-700">{benefit}</li>
                      ))}
                    </ul>
                    
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Nuestra Metodología</h3>
                    <p className="text-gray-700">{service.methodologies}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional services */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Servicios Adicionales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-700">{service.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Areas and subjects */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Áreas y Materias que Cubrimos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {targetAreas.map((area, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">{area.title}</h3>
                <ul className="space-y-2">
                  {area.subjects.map((subject, i) => (
                    <li key={i} className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                      <span>{subject}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div 
          className="bg-gradient-to-r from-primary to-blue-700 text-white p-8 rounded-lg shadow-md text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">¿Listo para potenciar tu formación aeronáutica?</h2>
          <p className="mb-6">
            Contáctanos para una evaluación gratuita y descubre cómo podemos ayudarte a alcanzar tus objetivos.
          </p>
          <a 
            href="/contacto" 
            className="inline-block px-6 py-3 bg-white text-primary font-semibold rounded-md hover:bg-gray-100 transition-colors"
          >
            Solicitar información
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicesPage;