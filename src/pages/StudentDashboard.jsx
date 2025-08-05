import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '../admin/AuthProvider';  
import { enrollmentService } from '../services/enrollmentService';
import { getGravatarUrl } from '../utils/gravatar';
import { 
  FaUser, 
  FaGraduationCap, 
  FaShoppingCart, 
  FaBookOpen, 
  FaTrophy,
  FaChartLine,
  FaClock,
  FaPlayCircle,
  FaDownload,
  FaStar,
  FaCalendarAlt,
  FaExternalLinkAlt
} from 'react-icons/fa';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      // Obtener datos del estudiante (no se usa actualmente pero se podría usar para datos adicionales)

      // Obtener cursos inscritos
      const enrollmentResult = await enrollmentService.getStudentCourses(user.uid);
      
      if (enrollmentResult.success && enrollmentResult.enrollments.length > 0) {
        // Si tiene inscripciones reales, usar esos datos
        const realCourses = enrollmentResult.enrollments.map(enrollment => ({
          id: enrollment.course.id,
          title: enrollment.course.title,
          progress: enrollment.progress || 0,
          nextLesson: enrollment.completedLessons?.length > 0 
            ? `Lección ${enrollment.completedLessons.length + 1}` 
            : 'Primera lección',
          totalLessons: enrollment.course.syllabus?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0,
          completedLessons: enrollment.completedLessons?.length || 0,
          enrolledDate: enrollment.enrolledAt?.toDate() || new Date(),
          lastAccessed: enrollment.lastAccessed?.toDate() || new Date(),
          instructor: enrollment.course.instructor || 'Instructor',
          certificate: enrollment.progress === 100
        }));
        setEnrolledCourses(realCourses);
      } else if (user.uid === 'test-user-123' || user.email === 'estudiante@test.com') {
        // Datos mock para usuario de prueba
        setEnrolledCourses([
          {
            id: 'roblox-principiantes',
            title: 'Roblox Studio para Principiantes',
            progress: 85,
            nextLesson: 'Sistemas de puntuación y gameplay',
            totalLessons: 15,
            completedLessons: 13,
            enrolledDate: new Date('2024-01-10'),
            lastAccessed: new Date('2024-03-15'),
            instructor: 'Carlos Rodriguez',
            certificate: false
          },
          {
            id: 'python-completo',
            title: 'Python para Principiantes y Avanzados',
            progress: 60,
            nextLesson: 'Programación orientada a objetos',
            totalLessons: 20,
            completedLessons: 12,
            enrolledDate: new Date('2024-02-01'),
            lastAccessed: new Date('2024-03-18'),
            instructor: 'Ana Martinez',
            certificate: false
          },
          {
            id: 'desarrollo-web',
            title: 'Desarrollo Web Moderno',
            progress: 30,
            nextLesson: 'JavaScript interactivo y ES6+',
            totalLessons: 24,
            completedLessons: 7,
            enrolledDate: new Date('2024-02-20'),
            lastAccessed: new Date('2024-03-17'),
            instructor: 'Miguel Torres',
            certificate: false
          },
          {
            id: 'construct-3',
            title: 'Construct 3 - Videojuegos sin Código',
            progress: 100,
            nextLesson: 'Todas las lecciones completadas',
            totalLessons: 12,
            completedLessons: 12,
            enrolledDate: new Date('2023-12-01'),
            lastAccessed: new Date('2024-01-15'),
            instructor: 'Sofia Lopez',
            certificate: true
          }
        ]);
      } else {
        // Para usuarios reales sin inscripciones
        setEnrolledCourses([]);
      }

      // Obtener historial de órdenes - datos mock para usuario de prueba
      if (user.uid === 'test-user-123') {
        setOrderHistory([
          {
            id: 'ORD-2023-12-001',
            date: new Date('2023-12-01'),
            items: [
              { title: 'Construct 3 - Videojuegos sin Código', price: 9900, originalPrice: 12900 }
            ],
            total: 9900,
            originalTotal: 12900,
            status: 'completed',
            paymentMethod: 'Tarjeta de crédito'
          },
          {
            id: 'ORD-2024-01-002',
            date: new Date('2024-01-10'),
            items: [
              { title: 'Roblox Studio para Principiantes', price: 12900, originalPrice: 15900 }
            ],
            total: 12900,
            originalTotal: 15900,
            status: 'completed',
            paymentMethod: 'MercadoPago'
          },
          {
            id: 'ORD-2024-02-003',
            date: new Date('2024-02-01'),
            items: [
              { title: 'Python para Principiantes y Avanzados', price: 15900, originalPrice: 18900 }
            ],
            total: 15900,
            originalTotal: 18900,
            status: 'completed',
            paymentMethod: 'Transferencia'
          },
          {
            id: 'ORD-2024-02-004',
            date: new Date('2024-02-20'),
            items: [
              { title: 'Desarrollo Web Moderno', price: 17900, originalPrice: 21900 }
            ],
            total: 17900,
            originalTotal: 21900,
            status: 'completed',
            paymentMethod: 'Tarjeta de débito'
          }
        ]);
      } else {
        // Para usuarios reales, obtener de Firebase
        setOrderHistory([]);
      }

    } catch (error) {
      console.error('Error al cargar datos del estudiante:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Mi Dashboard | Estudiante CODISEA</title>
        <meta name="description" content="Dashboard del estudiante - Gestiona tus cursos y progreso" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src={getGravatarUrl(user?.email, 128)} 
                  alt={user?.displayName || 'Estudiante'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback si Gravatar falla
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{display: 'none'}}>
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'E'}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary">
                  ¡Hola, {user?.displayName || 'Estudiante'}!
                </h1>
                <p className="text-gray-800">Bienvenido a tu dashboard de aprendizaje</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{enrolledCourses.length}</div>
                <div className="text-sm text-gray-700">Cursos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {Math.round(enrolledCourses.reduce((acc, course) => acc + course.progress, 0) / enrolledCourses.length) || 0}%
                </div>
                <div className="text-sm text-gray-700">Progreso</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-wrap border-b border-gray-200">
            {[
              { id: 'overview', label: 'Resumen', icon: FaChartLine },
              { id: 'courses', label: 'Mis Cursos', icon: FaBookOpen },
              { id: 'orders', label: 'Historial', icon: FaShoppingCart },
              { id: 'profile', label: 'Perfil', icon: FaUser }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary bg-blue-50'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Cursos Activos</h3>
                    <FaBookOpen className="text-2xl text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{enrolledCourses.length}</div>
                  <p className="text-gray-700">Cursos en progreso</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Horas Completadas</h3>
                    <FaClock className="text-2xl text-secondary" />
                  </div>
                  <div className="text-3xl font-bold text-secondary mb-2">
                    {enrolledCourses.reduce((acc, course) => acc + Math.round(course.completedLessons * 1.5), 0)}
                  </div>
                  <p className="text-gray-700">Horas de estudio</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Certificados</h3>
                    <FaTrophy className="text-2xl text-yellow-500" />
                  </div>
                  <div className="text-3xl font-bold text-yellow-500 mb-2">
                    {enrolledCourses.filter(course => course.progress === 100).length}
                  </div>
                  <p className="text-gray-700">Cursos completados</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-primary mb-6">Actividad Reciente</h3>
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div key={course.id} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4 mb-3">
                        <FaPlayCircle className="text-2xl text-primary" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{course.title}</h4>
                          <p className="text-sm text-gray-700">
                            Último acceso: {formatDate(course.lastAccessed)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">{course.progress}%</div>
                          <div className="text-sm text-gray-700">Completado</div>
                        </div>
                      </div>
                      
                      {/* Botón Aula Virtual compacto */}
                      <div className="flex justify-end">
                        <a
                          href="https://aula.codisea.dev/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-secondary text-primary text-sm rounded-full hover:bg-yellow-400 transition-colors flex items-center gap-2 font-semibold"
                        >
                          <FaExternalLinkAlt className="text-xs" />
                          Acceder al Curso (Moodle)
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary">{course.title}</h3>
                      {course.certificate && course.progress === 100 && (
                        <div className="flex items-center gap-1 mt-1">
                          <FaTrophy className="text-yellow-500 text-sm" />
                          <span className="text-xs text-yellow-600 font-semibold">Certificado disponible</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getProgressColor(course.progress)}`}>
                        {course.progress}%
                      </span>
                      {course.progress === 100 && (
                        <span className="text-xs text-green-600 font-semibold">✓ Completado</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-700 mb-2">
                      <span>Progreso del curso</span>
                      <span>{course.completedLessons}/{course.totalLessons} lecciones</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getProgressColor(course.progress)}`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaCalendarAlt />
                      <span className="text-sm">Inscrito: {formatDate(course.enrolledDate)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaBookOpen />
                      <span className="text-sm">Último tema visto: {course.nextLesson}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mt-6">
                    {/* Certificado disponible */}
                    {course.certificate && course.progress === 100 && (
                      <button className="w-full px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors flex items-center gap-2 justify-center font-semibold">
                        <FaTrophy />
                        Descargar Certificado
                      </button>
                    )}
                    
                    {/* Botón Aula Virtual - Acceso al curso en Moodle */}
                    <a
                      href="https://aula.codisea.dev/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2 bg-secondary text-primary rounded-full hover:bg-yellow-400 transition-colors flex items-center gap-2 justify-center font-semibold shadow-md"
                    >
                      <FaExternalLinkAlt />
                      Ir al Aula Virtual (Moodle)
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-primary mb-6">Historial de Compras</h3>
              <div className="space-y-6">
                {orderHistory.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 text-lg">Orden #{order.id}</h4>
                        <p className="text-sm text-gray-700 mb-1">{formatDate(order.date)}</p>
                        <p className="text-xs text-gray-600">Método: {order.paymentMethod}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-xl font-bold text-primary">
                            ${order.total.toLocaleString('es-AR')}
                          </div>
                          {order.originalTotal && order.originalTotal > order.total && (
                            <div className="text-sm text-gray-600 line-through">
                              ${order.originalTotal.toLocaleString('es-AR')}
                            </div>
                          )}
                        </div>
                        {order.originalTotal && order.originalTotal > order.total && (
                          <div className="text-xs text-green-600 font-semibold mb-2">
                            Ahorraste ${(order.originalTotal - order.total).toLocaleString('es-AR')}
                          </div>
                        )}
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
                          ✓ Completado
                        </span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4">
                      <h5 className="font-semibold text-gray-700 mb-2">Cursos adquiridos:</h5>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-50 rounded-lg p-3 text-gray-800">
                            <div>
                              <span className="font-medium text-gray-800">{item.title}</span>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <div className="text-xs text-green-600">
                                  ¡Descuento aplicado!
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-secondary">
                                ${item.price.toLocaleString('es-AR')}
                              </div>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <div className="text-xs text-gray-600 line-through">
                                  ${item.originalPrice.toLocaleString('es-AR')}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                
                {orderHistory.length === 0 && (
                  <div className="text-center py-12 text-gray-600">
                    <FaShoppingCart className="text-4xl mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No tienes compras registradas</p>
                    <p className="text-sm">¡Explora nuestros cursos y comienza a aprender!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-primary mb-6">Mi Perfil</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nombre</label>
                    <input 
                      type="text" 
                      value={user?.displayName || ''} 
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      value={user?.email || ''} 
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas de Aprendizaje</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-800">
                      <FaStar className="text-2xl text-yellow-500 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-800">4.8</div>
                      <div className="text-sm text-gray-700">Puntuación</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-800">
                      <FaTrophy className="text-2xl text-yellow-500 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-800">
                        {enrolledCourses.filter(c => c.progress === 100).length}
                      </div>
                      <div className="text-sm text-gray-700">Certificados</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-800">
                      <FaClock className="text-2xl text-blue-500 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-800">
                        {enrolledCourses.reduce((acc, course) => acc + Math.round(course.completedLessons * 1.5), 0)}h
                      </div>
                      <div className="text-sm text-gray-700">Estudiadas</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-800">
                      <FaGraduationCap className="text-2xl text-primary mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-800">{enrolledCourses.length}</div>
                      <div className="text-sm text-gray-700">Cursos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;