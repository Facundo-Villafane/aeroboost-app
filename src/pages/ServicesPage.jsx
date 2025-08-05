import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../admin/AuthProvider';
import { useCart } from '../contexts/CartContext';
import { useEnrollments } from '../hooks/useEnrollments';
import { 
  FaCubes, 
  FaPython, 
  FaGlobe, 
  FaGamepad, 
  FaMobile, 
  FaRobot, 
  FaCode, 
  FaUsers, 
  FaClock, 
  FaStar, 
  FaArrowRight, 
  FaPlayCircle,
  FaGraduationCap,
  FaHeart,
  FaLaptop,
  FaBrain,
  FaTrophy,
  FaShoppingCart,
  FaDollarSign
} from 'react-icons/fa';

const ServicesPage = () => {
  const [activeSection, setActiveSection] = useState('');
  const [courses, setCourses] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [regularCourses, setRegularCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToCart, getCartItemsCount, isInCart } = useCart();
  const { isEnrolledInCourse } = useEnrollments();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const coursesQuery = query(
        collection(db, 'courses'),
        where('status', '==', 'active'),
        orderBy('featured', 'desc'),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(coursesQuery);
      const coursesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setCourses(coursesData);
      
      // Separar cursos destacados y regulares
      const featured = coursesData.filter(course => course.featured);
      const regular = coursesData.filter(course => !course.featured);
      
      setFeaturedCourses(featured);
      setRegularCourses(regular);
      
      // Establecer el primer curso como activo si hay cursos
      if (featured.length > 0) {
        setActiveSection(featured[0].id);
      } else if (regular.length > 0) {
        setActiveSection(regular[0].id);
      }
    } catch (error) {
      console.error('Error al cargar cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar curso al carrito con notificación mejorada
  const handleAddToCart = (course) => {
    addToCart(course);
    
    // Mostrar notificación temporal más elegante
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-success text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
    notification.innerHTML = `¡${course.title} agregado al carrito!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  // Función para mostrar estado del curso
  const getCourseButtonState = (course) => {
    if (user && isEnrolledInCourse(course.id)) {
      return 'enrolled';
    }
    if (isInCart(course.id)) {
      return 'in_cart';
    }
    return 'available';
  };

  // Función para obtener icono según categoría
  const getCategoryIcon = (category) => {
    const iconMap = {
      'roblox': <FaCubes className="text-8xl text-secondary mb-6" />,
      'python': <FaPython className="text-8xl text-secondary mb-6" />,
      'web': <FaGlobe className="text-8xl text-secondary mb-6" />,
      'ai': <FaRobot className="text-8xl text-secondary mb-6" />,
      'gamedev': <FaGamepad className="text-8xl text-secondary mb-6" />,
      'mobile': <FaMobile className="text-8xl text-secondary mb-6" />,
      'programming': <FaCode className="text-8xl text-secondary mb-6" />
    };
    return iconMap[category] || <FaCode className="text-8xl text-secondary mb-6" />;
  };

  const getCategoryIconSmall = (category) => {
    const iconMap = {
      'roblox': <FaCubes className="text-3xl text-secondary" />,
      'python': <FaPython className="text-3xl text-secondary" />,
      'web': <FaGlobe className="text-3xl text-secondary" />,
      'ai': <FaRobot className="text-3xl text-secondary" />,
      'gamedev': <FaGamepad className="text-3xl text-secondary" />,
      'mobile': <FaMobile className="text-3xl text-secondary" />,
      'programming': <FaCode className="text-3xl text-secondary" />
    };
    return iconMap[category] || <FaCode className="text-3xl text-secondary" />;
  };

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="loading-spinner mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Cargando cursos...</h2>
            <p className="text-gray-500">Estamos preparando la mejor información para ti</p>
          </div>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <FaCode className="text-6xl text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Próximamente</h2>
            <p className="text-gray-500 mb-8">Estamos preparando cursos increíbles para ti</p>
            <Link 
              to="/contacto"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-accent transition-colors"
            >
              <FaUsers />
              Contáctanos para más información
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const whyChooseUs = [
    {
      icon: <FaUsers className="text-4xl text-secondary mb-4" />,
      title: "Grupos Reducidos",
      description: "Máximo 8 estudiantes por clase para atención personalizada"
    },
    {
      icon: <FaBrain className="text-4xl text-secondary mb-4" />,
      title: "Metodología Probada",
      description: "Enfoque práctico que combina teoría con proyectos reales"
    },
    {
      icon: <FaLaptop className="text-4xl text-secondary mb-4" />,
      title: "Tecnología Actual",
      description: "Herramientas y lenguajes usados por la industria tech"
    },
    {
      icon: <FaTrophy className="text-4xl text-secondary mb-4" />,
      title: "Resultados Comprobados",
      description: "95% de nuestros estudiantes completan exitosamente sus cursos"
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <Helmet>
        <title>Cursos de Programación para Jóvenes | CODISEA</title>
        <meta 
          name="description" 
          content="Descubre nuestros cursos de programación diseñados especialmente para jóvenes. Roblox, Python, Desarrollo Web e Inteligencia Artificial. ¡Aprende programando!"
        />
        <meta 
          name="keywords" 
          content="cursos programación jóvenes, Roblox Studio, Python principiantes, desarrollo web, inteligencia artificial, programación para niños, CODISEA"
        />
      </Helmet>

      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-primary mb-6 brand-font">
            Nuestros Cursos de Programación
          </h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-8 leading-relaxed">
            Transforma tu futuro con nuestros programas educativos diseñados especialmente para estudiantes 
            de 8 a 17 años. Aprende las tecnologías más demandadas mientras te diviertes creando proyectos increíbles.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md">
              <FaUsers className="text-secondary" />
              <span className="font-semibold text-gray-700">500+ Estudiantes</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md">
              <FaStar className="text-secondary" />
              <span className="font-semibold text-gray-700">4.9/5 Puntuación</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md">
              <FaTrophy className="text-secondary" />
              <span className="font-semibold text-gray-700">95% Satisfacción</span>
            </div>
            {getCartItemsCount() > 0 && (
              <div className="flex items-center gap-2 bg-secondary text-primary rounded-full px-6 py-3 shadow-md">
                <FaShoppingCart className="text-primary" />
                <span className="font-semibold">
                  {getCartItemsCount()} en el carrito
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Navigation Tabs para cursos destacados */}
        {featuredCourses.length > 0 && (
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {featuredCourses.map((course, index) => (
              <button
                key={course.id}
                onClick={() => {
                  document.getElementById(course.id).scrollIntoView({ behavior: 'smooth' });
                  setActiveSection(course.id);
                }}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeSection === course.id 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                {course.title}
              </button>
            ))}
          </motion.div>
        )}

        {/* Main Courses Detailed */}
        <div className="space-y-20 mb-20">
          {mainServices.map((service, index) => (
            <motion.div 
              key={index}
              id={service.id}
              className="scroll-mt-24"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Content Side */}
                  <div className="p-8 lg:p-12">
                    <div className="flex items-center mb-6">
                      <div className="mr-6">{service.icon}</div>
                    </div>
                    
                    <h2 className="text-4xl font-bold text-primary mb-4 brand-font">
                      {service.title}
                    </h2>
                    <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                      {service.description}
                    </p>

                    {/* Course Info */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium">Edades</div>
                        <div className="text-lg font-bold text-primary">{service.ageRange}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium">Duración</div>
                        <div className="text-lg font-bold text-primary">{service.duration}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium">Nivel</div>
                        <div className="text-lg font-bold text-primary">{service.level}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium">Precio</div>
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-bold text-secondary">
                            ${service.price.toLocaleString('es-AR')}
                          </div>
                          {service.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">
                              ${service.originalPrice.toLocaleString('es-AR')}
                            </div>
                          )}
                        </div>
                        {service.originalPrice && (
                          <div className="text-xs text-green-600 font-semibold mt-1">
                            ¡Ahorrás ${(service.originalPrice - service.price).toLocaleString('es-AR')}!
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {(() => {
                        const buttonState = getCourseButtonState(service);
                        
                        switch (buttonState) {
                          case 'enrolled':
                            return (
                              <Link
                                to="/student/dashboard"
                                className="px-8 py-4 bg-success text-white font-semibold rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                              >
                                <FaGraduationCap />
                                Ir al Curso
                              </Link>
                            );
                          
                          case 'in_cart':
                            return (
                              <div className="flex items-center gap-4">
                                <span className="px-8 py-4 bg-secondary text-primary font-semibold rounded-full flex items-center gap-2 shadow-lg">
                                  <FaShoppingCart />
                                  En el Carrito
                                </span>
                                <Link
                                  to="/contacto"
                                  className="px-6 py-4 border-2 border-secondary text-secondary font-semibold rounded-full hover:bg-secondary hover:text-primary transition-all duration-300 flex items-center gap-2"
                                >
                                  Finalizar Compra
                                </Link>
                              </div>
                            );
                          
                          default:
                            return (
                              <>
                                <button 
                                  onClick={() => handleAddToCart(service)}
                                  className="px-8 py-4 bg-gradient-primary text-white font-semibold rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                                >
                                  <FaShoppingCart />
                                  Agregar al Carrito
                                </button>
                                {!user && (
                                  <Link
                                    to="/student/login"
                                    className="px-6 py-4 bg-gradient-accent text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                                  >
                                    <FaGraduationCap />
                                    Iniciar Sesión
                                  </Link>
                                )}
                              </>
                            );
                        }
                      })()}
                      
                      <button className="px-6 py-4 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2">
                        <FaPlayCircle />
                        Ver Demo
                      </button>
                    </div>
                  </div>

                  {/* Details Side */}
                  <div className="bg-gradient-to-br from-primary to-accent p-8 lg:p-12 text-white">
                    <div className="space-y-8">
                      {/* Benefits */}
                      <div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                          <FaHeart />
                          ¿Por qué elegir este curso?
                        </h3>
                        <ul className="space-y-3">
                          {service.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <FaStar className="text-secondary mt-1 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Projects */}
                      <div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                          <FaCode />
                          Proyectos que crearás
                        </h3>
                        <div className="space-y-2">
                          {service.projects.map((project, i) => (
                            <div key={i} className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                              <span className="font-medium">{project}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Courses */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-center text-primary mb-4 brand-font">
            Cursos Especializados
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Amplía tus conocimientos con nuestros cursos especializados diseñados para profundizar en áreas específicas
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalCourses.map((course, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-6">{course.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-3 brand-font">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="space-y-2 text-sm mb-4">
                  <div><strong>Duración:</strong> {course.duration}</div>
                  <div><strong>Edades:</strong> {course.ageRange}</div>
                </div>
                
                {/* Precio */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="text-xl font-bold text-secondary">
                      ${course.price.toLocaleString('es-AR')}
                    </div>
                    {course.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">
                        ${course.originalPrice.toLocaleString('es-AR')}
                      </div>
                    )}
                  </div>
                  {course.originalPrice && (
                    <div className="text-xs text-green-600 font-semibold text-center">
                      ¡Ahorrás ${(course.originalPrice - course.price).toLocaleString('es-AR')}!
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => handleAddToCart(course)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-accent transition-all duration-300 transform hover:scale-105 w-full justify-center"
                >
                  <FaShoppingCart />
                  Agregar al Carrito
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div 
          className="bg-white rounded-3xl p-12 shadow-xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-center text-primary mb-12 brand-font">
            ¿Por qué elegir CODISEA?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Final */}
        <motion.div 
          className="bg-gradient-to-r from-primary to-accent text-white rounded-3xl p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-6 brand-font">
            ¿Listo para comenzar tu aventura en programación?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Únete a cientos de estudiantes que ya están creando el futuro. 
            Contacta con nosotros para más información sobre nuestros programas.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/contacto"
              className="px-8 py-4 bg-secondary text-outline font-semibold rounded-full hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
            >
              <FaGraduationCap />
              Inscríbete Ahora
            </Link>
            <Link 
              to="/sobre-nosotros"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-primary transition-all duration-300 flex items-center gap-2"
            >
              <FaUsers />
              Conoce al Equipo
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicesPage;