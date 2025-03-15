
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FaGraduationCap, FaAward, FaUsers, FaHandshake } from 'react-icons/fa';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { getGravatarUrl } from '../utils/gravatar';
import { Helmet } from 'react-helmet';

const AboutPage = () => {
  const [instructors, setInstructors] = useState([]);
  const [loadingInstructors, setLoadingInstructors] = useState(true);

  // Asegurar que la página se muestre desde el principio
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchInstructors();
  }, []);

  // Cargar instructores desde Firebase
  const fetchInstructors = async () => {
    setLoadingInstructors(true);
    try {
      const instructorsQuery = query(
        collection(db, 'users'),
        orderBy('role'), // Founders first, then instructors
        limit(8) // Limitar a los primeros 8
      );
      
      const snapshot = await getDocs(instructorsQuery);
      
      if (!snapshot.empty) {
        const instructorsList = snapshot.docs.map(doc => {
          const data = doc.data();
          
          // Asegurar que cada instructor tenga una URL de Gravatar actualizada
          if (data.email) {
            data.photoURL = getGravatarUrl(data.email, 300);
          }
          
          return {
            id: doc.id,
            ...data
          };
        });
        
        setInstructors(instructorsList);
      }
    } catch (error) {
      console.error('Error al cargar instructores:', error);
    } finally {
      setLoadingInstructors(false);
    }
  };

  // Valores y misión
  const values = [
    {
      icon: <FaGraduationCap className="text-3xl text-primary mb-4" />,
      title: "Excelencia Educativa",
      description: "Nos comprometemos a proporcionar la más alta calidad en todas nuestras actividades educativas, manteniendo estándares rigurosos y adaptándonos a las necesidades individuales."
    },
    {
      icon: <FaAward className="text-3xl text-primary mb-4" />,
      title: "Profesionalismo",
      description: "Fomentamos un ambiente que valora la ética, la integridad y el compromiso con la mejora continua, tanto en nuestros instructores como en nuestros estudiantes."
    },
    {
      icon: <FaUsers className="text-3xl text-primary mb-4" />,
      title: "Enfoque Personalizado",
      description: "Reconocemos la individualidad de cada estudiante y adaptamos nuestros métodos de enseñanza para maximizar su potencial de aprendizaje."
    },
    {
      icon: <FaHandshake className="text-3xl text-primary mb-4" />,
      title: "Colaboración",
      description: "Trabajamos en estrecha colaboración con instituciones educativas y profesionales del sector para asegurar que nuestros servicios sean relevantes y actualizados."
    }
  ];

  return (
    <div className="py-16">
      <Helmet>
        <title>Sobre Nosotros | AeroBoost Learning Center</title>
        <meta 
          name="description" 
          content="Conoce la historia de AeroBoost, nuestro equipo docente y los valores que nos han convertido en referentes del apoyo académico especializado para carreras aeronáuticas."
        />
        <meta 
          name="keywords" 
          content="AeroBoost historia, instructores aeronáuticos, centro formación aviación, equipo docente aviación, valores educativos aeronáutica"
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nuestra Historia</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conoce quiénes somos y nuestra pasión por la formación aeronáutica de excelencia
          </p>
        </motion.div>

        {/* Historia y descripción */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-12 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestros Inicios</h2>
            <p className="text-gray-700 mb-4">
            AeroBoost Learning Center nace de la visión de un grupo de profesionales del sector aeronáutico que identificaron la necesidad de contar con servicios de apoyo académico especializados para estudiantes de carreras aeronáuticas.
            </p>
            <p className="text-gray-700 mb-4">
            Lo que comenzó como una idea para ofrecer tutoría especializada se ha transformado en un proyecto educativo integral, enfocado en brindar apoyo personalizado a estudiantes que enfrentan los desafíos de estas exigentes carreras.            </p>
            <p className="text-gray-700">
            Nuestro equipo combina una sólida experiencia en el campo aeronáutico con metodologías pedagógicas efectivas, diseñadas específicamente para abordar las necesidades únicas de los estudiantes de aviación. Nuestro compromiso es convertirnos en un aliado esencial en el camino académico de quienes aspiran a destacarse en el apasionante mundo de la aeronáutica.            </p>
          </motion.div>
          
        </div>

        {/* Misión y Visión */}
        <motion.div 
          className="bg-gray-50 p-8 rounded-lg shadow-sm mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-primary mb-4">Nuestra Misión</h2>
              <p className="text-gray-700">
                Proporcionar servicios educativos de alta calidad que ayuden a los estudiantes de carreras aeronáuticas a superar sus desafíos académicos, desarrollar confianza en sus habilidades y alcanzar sus metas profesionales en la industria de la aviación.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-primary mb-4">Nuestra Visión</h2>
              <p className="text-gray-700">
                Ser reconocidos como el centro de referencia en apoyo académico especializado para carreras aeronáuticas, innovando constantemente en nuestras metodologías y expandiendo nuestro alcance para beneficiar a estudiantes en todo el país.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Valores */}
        <motion.div 
          className="mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Equipo docente */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Nuestro Equipo Docente</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Contamos con instructores altamente calificados con amplia experiencia tanto en la industria aeronáutica como en la enseñanza.
          </p>
          
          {loadingInstructors ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <p className="mt-6 text-gray-500 text-xl">Cargando perfiles...</p>
            </div>
          ) : instructors.length === 0 ? (
            <div className="text-center bg-white py-16 rounded-lg shadow-md">
              <p className="text-gray-500 text-xl">
                Próximamente conocerás a nuestro equipo docente.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {instructors.map((instructor, index) => (
                <motion.div 
                  key={instructor.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="aspect-w-1 aspect-h-1">
                    <img 
                      src={instructor.photoURL} 
                      alt={instructor.displayName} 
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">{instructor.displayName}</h3>
                    <p className="text-primary font-medium mb-2">
                      {instructor.role === 'founder' ? 'Fundador & Instructor' : 'Instructor'}
                    </p>
                    {instructor.specialty && (
                      <p className="text-gray-700 font-medium mb-1">Especialidad: {instructor.specialty}</p>
                    )}
                    {instructor.experience && (
                      <p className="text-gray-700 text-sm">{instructor.experience}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Call to action */}
        <motion.div 
          className="bg-gradient-to-r from-primary to-blue-700 text-white p-8 rounded-lg shadow-md text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">¿Quieres formar parte de nuestra comunidad educativa?</h2>
          <p className="mb-6">
            Descubre cómo nuestro equipo y nuestros servicios pueden ayudarte a alcanzar tus metas académicas.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/servicios"
              className="px-6 py-3 bg-white text-primary font-semibold rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => window.scrollTo(0, 0)}
            >
              Conoce nuestros servicios
            </Link>
            <Link 
              to="/contacto"
              className="px-6 py-3 border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-primary transition-colors"
              onClick={() => window.scrollTo(0, 0)}
            >
              Contáctanos
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;