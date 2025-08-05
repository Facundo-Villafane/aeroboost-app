import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { getGravatarUrl } from '../utils/gravatar';
import { 
  FaCode, 
  FaUsers, 
  FaHeart, 
  FaLightbulb, 
  FaTrophy,
  FaGraduationCap,
  FaStar,
  FaRocket,
  FaGlobe,
  FaAward,
  FaCalendarAlt
} from 'react-icons/fa';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Sobre Nosotros - CODISEA | Academia de Programación</title>
        <meta 
          name="description" 
          content="Conoce la historia de CODISEA, nuestro equipo de instructores expertos y los valores que nos han convertido en referentes de la educación en programación para jóvenes."
        />
        <meta 
          name="keywords" 
          content="CODISEA historia, instructores programación, academia coding, equipo docente, valores educativos, programación jóvenes Argentina"
        />
      </Helmet>

      {/* Hero Section Modernizado */}
      <div className="relative bg-gradient-to-br from-primary via-accent to-secondary text-white py-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        </div>
        
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <FaHeart className="text-white" />
              <span className="font-semibold">Nuestra Historia</span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-8 brand-font leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Transformando{' '}
              <span className="text-secondary">
                el futuro
              </span>{' '}
              de la educación
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Desde 2020, CODISEA ha sido pionera en enseñar programación de manera divertida, 
              creativa e inspiradora para las nuevas generaciones digitales.
            </motion.p>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="opacity-80">Estudiantes graduados</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">4</div>
                <div className="opacity-80">Años de experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="opacity-80">Satisfacción familiar</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Historia */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-primary mb-6">Nuestra Historia</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4">
              CODISEA nació en 2020 de la visión de un grupo de desarrolladores y educadores que identificaron 
              una necesidad crítica: enseñar programación de manera efectiva y divertida a las nuevas generaciones.
            </p>
            <p className="mb-4">
              Durante la pandemia, cuando la educación digital se volvió esencial, nos dimos cuenta de que los 
              métodos tradicionales no funcionaban para enseñar programación a jóvenes. Necesitábamos algo diferente, 
              algo que los motivara y los emocionara.
            </p>
            <p>
              Hoy, después de formar a más de 500 estudiantes, CODISEA se ha convertido en una referencia en 
              educación tecnológica para jóvenes, manteniendo siempre nuestro compromiso con la excelencia y 
              la innovación educativa.
            </p>
          </div>
        </motion.div>

        {/* Estadísticas */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Nuestros Logros</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <FaGraduationCap className="text-4xl text-secondary mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary mb-1">500+</div>
              <div className="text-gray-600">Estudiantes graduados</div>
            </div>
            <div className="text-center">
              <FaTrophy className="text-4xl text-secondary mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary mb-1">95%</div>
              <div className="text-gray-600">Tasa de finalización</div>
            </div>
            <div className="text-center">
              <FaStar className="text-4xl text-secondary mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary mb-1">4.9/5</div>
              <div className="text-gray-600">Satisfacción promedio</div>
            </div>
            <div className="text-center">
              <FaCode className="text-4xl text-secondary mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary mb-1">15+</div>
              <div className="text-gray-600">Cursos disponibles</div>
            </div>
          </div>
        </motion.div>

        {/* Valores */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <FaHeart className="text-4xl text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Pasión por Enseñar</h3>
              <p className="text-gray-600">
                Creemos que la programación es una herramienta poderosa para transformar ideas en realidad.
              </p>
            </div>
            <div className="text-center">
              <FaUsers className="text-4xl text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Enfoque Personalizado</h3>
              <p className="text-gray-600">
                Cada estudiante es único. Adaptamos nuestro método de enseñanza para maximizar el potencial.
              </p>
            </div>
            <div className="text-center">
              <FaLightbulb className="text-4xl text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Innovación Constante</h3>
              <p className="text-gray-600">
                Mantenemos nuestros programas actualizados con las últimas tecnologías educativas.
              </p>
            </div>
            <div className="text-center">
              <FaTrophy className="text-4xl text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Excelencia Educativa</h3>
              <p className="text-gray-600">
                Nos comprometemos a brindar la mejor experiencia educativa con instructores capacitados.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Equipo */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">Nuestro Equipo</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Contamos con instructores altamente calificados con amplia experiencia tanto en la industria tecnológica como en la enseñanza.
          </p>
          
          {loadingInstructors ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <p className="mt-6 text-gray-500 text-xl">Cargando perfiles...</p>
            </div>
          ) : instructors.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xl">
                Próximamente conocerás a nuestro equipo docente.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {instructors.map((instructor, index) => (
                <motion.div 
                  key={instructor.id}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary">
                    <img 
                      src={instructor.photoURL} 
                      alt={instructor.displayName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-1">{instructor.displayName}</h3>
                  <p className="text-secondary font-semibold mb-2">
                    {instructor.role === 'founder' ? 'Fundador & Instructor' : 'Instructor'}
                  </p>
                  {instructor.specialty && (
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Especialidad:</strong> {instructor.specialty}
                    </p>
                  )}
                  {instructor.experience && (
                    <p className="text-sm text-gray-600">{instructor.experience}</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="bg-gradient-to-r from-primary to-accent text-white rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
          <p className="text-lg mb-6 opacity-90">
            Únete a la comunidad CODISEA y descubre cómo la programación puede transformar tu futuro.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/servicios"
              className="px-6 py-3 bg-secondary text-primary font-semibold rounded-full hover:bg-yellow-400 transition-all duration-300 flex items-center gap-2"
              onClick={() => window.scrollTo(0, 0)}
            >
              <FaCode />
              Conoce Nuestros Cursos
            </Link>
            <Link 
              to="/contacto"
              className="px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-primary transition-all duration-300 flex items-center gap-2"
              onClick={() => window.scrollTo(0, 0)}
            >
              <FaUsers />
              Contáctanos
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;