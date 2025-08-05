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
  FaShoppingCart,
  FaGraduationCap,
  FaHeart,
  FaLaptop,
  FaBrain,
  FaTrophy
} from 'react-icons/fa';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
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
    } catch (error) {
      console.error('Error al cargar cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (course) => {
    addToCart(course);
    
    // Mostrar notificación temporal
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

  const getCourseButtonState = (course) => {
    if (user && isEnrolledInCourse(course.id)) {
      return 'enrolled';
    }
    if (isInCart(course.id)) {
      return 'in_cart';
    }
    return 'available';
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'roblox': <FaCubes className="text-4xl text-secondary" />,
      'python': <FaPython className="text-4xl text-secondary" />,
      'web': <FaGlobe className="text-4xl text-secondary" />,
      'ai': <FaRobot className="text-4xl text-secondary" />,
      'gamedev': <FaGamepad className="text-4xl text-secondary" />,
      'mobile': <FaMobile className="text-4xl text-secondary" />,
      'programming': <FaCode className="text-4xl text-secondary" />
    };
    return iconMap[category] || <FaCode className="text-4xl text-secondary" />;
  };

  const categories = [
    { id: 'all', name: 'Todos los cursos', icon: <FaCode /> },
    { id: 'roblox', name: 'Roblox', icon: <FaCubes /> },
    { id: 'python', name: 'Python', icon: <FaPython /> },
    { id: 'web', name: 'Desarrollo Web', icon: <FaGlobe /> },
    { id: 'ai', name: 'Inteligencia Artificial', icon: <FaRobot /> },
    { id: 'gamedev', name: 'Desarrollo de Juegos', icon: <FaGamepad /> },
    { id: 'mobile', name: 'Apps Móviles', icon: <FaMobile /> }
  ];

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="loading-spinner mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Cargando cursos...</h2>
            <p className="text-gray-500">Preparando la mejor información para ti</p>
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

  return (
    <div className="py-16 bg-gray-50">
      <Helmet>
        <title>Catálogo de Cursos | CODISEA - Programación para Jóvenes</title>
        <meta 
          name="description" 
          content="Explora nuestro catálogo completo de cursos de programación para jóvenes. Roblox, Python, Desarrollo Web, IA y más. ¡Encuentra el curso perfecto para ti!"
        />
        <meta 
          name="keywords" 
          content="catálogo cursos programación, cursos CODISEA, programación jóvenes, Roblox, Python, desarrollo web, inteligencia artificial"
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
            Catálogo de Cursos
          </h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-8 leading-relaxed">
            Descubre todos nuestros cursos de programación diseñados especialmente para jóvenes. 
            Desde principiantes hasta niveles avanzados, tenemos el curso perfecto para ti.
          </p>
          
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md">
              <FaTrophy className="text-secondary" />
              <span className="font-semibold text-gray-700">{courses.length} Cursos Disponibles</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md">
              <FaStar className="text-secondary" />
              <span className="font-semibold text-gray-700">100% Online</span>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                selectedCategory === category.id 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              className="card-modern overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Course Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary to-accent overflow-hidden">
                {course.image ? (
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`absolute inset-0 flex items-center justify-center ${course.image ? 'hidden' : 'flex'}`}
                  style={course.image ? {display: 'none'} : {}}
                >
                  {getCategoryIcon(course.category)}
                </div>
                
                {/* Badge */}
                {course.featured && (
                  <div className="absolute top-4 left-4 bg-secondary text-primary px-3 py-1 rounded-full text-sm font-semibold">
                    Destacado
                  </div>
                )}
                
                {/* Discount Badge */}
                {course.originalPrice && course.originalPrice > course.price && (
                  <div className="absolute top-4 right-4 bg-success text-white px-3 py-1 rounded-full text-sm font-semibold">
                    -{Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                    {course.level}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                    {course.ageRange}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 brand-font">
                  {course.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {course.shortDescription || course.description?.substring(0, 100) + '...'}
                </p>

                {/* Course Details */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FaClock />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaUsers />
                    <span>Max {course.maxStudents || 8}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-secondary">
                      ${course.price.toLocaleString('es-AR')}
                    </div>
                    {course.originalPrice && course.originalPrice > course.price && (
                      <div className="text-sm text-gray-500 line-through">
                        ${course.originalPrice.toLocaleString('es-AR')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {(() => {
                    const buttonState = getCourseButtonState(course);
                    
                    switch (buttonState) {
                      case 'enrolled':
                        return (
                          <Link
                            to="/student/dashboard"
                            className="w-full px-4 py-3 bg-success text-white font-semibold rounded-full hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <FaGraduationCap />
                            Ir al Curso
                          </Link>
                        );
                      
                      case 'in_cart':
                        return (
                          <div className="w-full px-4 py-3 bg-secondary text-primary font-semibold rounded-full flex items-center justify-center gap-2">
                            <FaShoppingCart />
                            En el Carrito
                          </div>
                        );
                      
                      default:
                        return (
                          <button 
                            onClick={() => handleAddToCart(course)}
                            className="w-full px-4 py-3 bg-primary text-white font-semibold rounded-full hover:bg-accent transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                          >
                            <FaShoppingCart />
                            Agregar al Carrito
                          </button>
                        );
                    }
                  })()}
                  
                  <Link 
                    to={`/cursos/${course.id}`}
                    className="w-full px-4 py-3 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaArrowRight />
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State for Filtered Results */}
        {filteredCourses.length === 0 && selectedCategory !== 'all' && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaCode className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay cursos en esta categoría
            </h3>
            <p className="text-gray-500 mb-6">
              Prueba seleccionando otra categoría o explora todos nuestros cursos
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-6 py-3 bg-primary text-white rounded-full hover:bg-accent transition-colors"
            >
              Ver Todos los Cursos
            </button>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div 
          className="bg-gradient-to-r from-primary to-accent text-white rounded-3xl p-12 text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-6 brand-font">
            ¿Necesitas ayuda para elegir?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Nuestros expertos pueden ayudarte a encontrar el curso perfecto 
            según tus intereses y nivel de experiencia.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/contacto"
              className="px-8 py-4 bg-secondary text-outline font-semibold rounded-full hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
            >
              <FaUsers />
              Contactar Asesor
            </Link>
            <Link 
              to="/sobre-nosotros"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-primary transition-all duration-300 flex items-center gap-2"
            >
              <FaHeart />
              Conoce CODISEA
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CoursesPage;