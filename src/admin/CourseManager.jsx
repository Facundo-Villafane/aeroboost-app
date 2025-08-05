import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  orderBy, 
  query,
  updateDoc 
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaEyeSlash,
  FaCubes,
  FaPython,
  FaGlobe,
  FaRobot,
  FaGamepad,
  FaMobile,
  FaCode,
  FaDollarSign,
  FaUsers,
  FaClock,
  FaSort
} from 'react-icons/fa';

const CourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchCourses();
  }, [sortBy, sortOrder]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const coursesQuery = query(
        collection(db, 'courses'),
        orderBy(sortBy, sortOrder)
      );
      
      const snapshot = await getDocs(coursesQuery);
      const coursesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setCourses(coursesData);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      setError('Error al cargar los cursos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId, courseTitle) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el curso "${courseTitle}"?`)) {
      try {
        await deleteDoc(doc(db, 'courses', courseId));
        setCourses(courses.filter(course => course.id !== courseId));
      } catch (error) {
        console.error('Error al eliminar curso:', error);
        setError('Error al eliminar el curso');
      }
    }
  };

  const toggleStatus = async (courseId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateDoc(doc(db, 'courses', courseId), {
        status: newStatus,
        updatedAt: new Date()
      });
      
      setCourses(courses.map(course => 
        course.id === courseId 
          ? { ...course, status: newStatus }
          : course
      ));
    } catch (error) {
      console.error('Error al cambiar estado del curso:', error);
      setError('Error al cambiar el estado del curso');
    }
  };

  const getCourseIcon = (category) => {
    const icons = {
      'roblox': FaCubes,
      'python': FaPython,
      'web': FaGlobe,
      'ai': FaRobot,
      'gamedev': FaGamepad,
      'mobile': FaMobile,
      'programming': FaCode
    };
    
    const IconComponent = icons[category] || FaCode;
    return <IconComponent className="text-2xl" />;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Cursos</h1>
          <p className="text-gray-600 mt-1">
            Administra los cursos que aparecen en la página de servicios
          </p>
        </div>
        <Link
          to="/admin/courses/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus />
          Nuevo Curso
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cursos</p>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
            </div>
            <FaCode className="text-3xl text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cursos Activos</p>
              <p className="text-2xl font-bold text-green-600">
                {courses.filter(c => c.status === 'active').length}
              </p>
            </div>
            <FaEye className="text-3xl text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cursos Inactivos</p>
              <p className="text-2xl font-bold text-yellow-600">
                {courses.filter(c => c.status === 'inactive').length}
              </p>
            </div>
            <FaEyeSlash className="text-3xl text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Precio Promedio</p>
              <p className="text-2xl font-bold text-purple-600">
                {courses.length > 0 
                  ? formatPrice(courses.reduce((sum, c) => sum + (c.price || 0), 0) / courses.length)
                  : '$0'
                }
              </p>
            </div>
            <FaDollarSign className="text-3xl text-purple-600" />
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Lista de Cursos</h2>
        </div>
        
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <FaCode className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay cursos</h3>
            <p className="text-gray-500 mb-6">Comienza creando tu primer curso</p>
            <Link
              to="/admin/courses/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
            >
              <FaPlus />
              Crear Primer Curso
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Curso
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center gap-1">
                      Precio
                      <FaSort className="text-xs" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detalles
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Estado
                      <FaSort className="text-xs" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                          {getCourseIcon(course.category)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs">
                            {course.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {course.ageRange} • {course.duration}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-semibold text-green-600">
                          {formatPrice(course.price)}
                        </div>
                        {course.originalPrice && course.originalPrice > course.price && (
                          <div className="text-xs text-gray-500 line-through">
                            {formatPrice(course.originalPrice)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <FaUsers className="text-xs" />
                          {course.level}
                        </div>
                        <div className="flex items-center gap-1">
                          <FaClock className="text-xs" />
                          {course.duration}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(course.id, course.status)}
                        className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                          course.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        } transition-colors`}
                      >
                        {course.status === 'active' ? (
                          <>
                            <FaEye className="mr-1" />
                            Activo
                          </>
                        ) : (
                          <>
                            <FaEyeSlash className="mr-1" />
                            Inactivo
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/courses/edit/${course.id}`}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                          title="Editar curso"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(course.id, course.title)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar curso"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManager;