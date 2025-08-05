import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  orderBy, 
  query,
  updateDoc,
  where 
} from 'firebase/firestore';
import { db } from '../firebase';
import { getGravatarUrl } from '../utils/gravatar';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaEyeSlash,
  FaUser,
  FaUsers,
  FaGraduationCap,
  FaDollarSign,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaSort,
  FaSearch,
  FaFilter
} from 'react-icons/fa';

const StudentManager = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('displayName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchStudents();
  }, [sortBy, sortOrder]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Buscar usuarios con rol de estudiante o sin rol específico
      const studentsQuery = query(
        collection(db, 'users'),
        orderBy(sortBy, sortOrder)
      );
      
      const snapshot = await getDocs(studentsQuery);
      const studentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).filter(user => !user.role || user.role === 'student');
      
      // Para propósitos de demo, agregar datos mock para el usuario de prueba
      const mockStudent = {
        id: 'test-user-123',
        displayName: 'Juan Pérez',
        email: 'estudiante@test.com',
        phone: '+54 11 1234-5678',
        dateOfBirth: '2010-05-15',
        status: 'active',
        enrolledCourses: 4,
        totalSpent: 56600,
        lastAccess: new Date('2024-03-18'),
        joinDate: new Date('2023-12-01'),
        completedCourses: 1,
        averageProgress: 68
      };

      const allStudents = [mockStudent, ...studentsData];
      setStudents(allStudents);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      setError('Error al cargar los estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId, studentName) => {
    if (studentId === 'test-user-123') {
      setError('No se puede eliminar el usuario de prueba');
      return;
    }

    if (window.confirm(`¿Estás seguro de que quieres eliminar al estudiante "${studentName}"?`)) {
      try {
        await deleteDoc(doc(db, 'users', studentId));
        setStudents(students.filter(student => student.id !== studentId));
      } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        setError('Error al eliminar el estudiante');
      }
    }
  };

  const toggleStatus = async (studentId, currentStatus) => {
    if (studentId === 'test-user-123') {
      setError('No se puede modificar el estado del usuario de prueba');
      return;
    }

    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateDoc(doc(db, 'users', studentId), {
        status: newStatus,
        updatedAt: new Date()
      });
      
      setStudents(students.map(student => 
        student.id === studentId 
          ? { ...student, status: newStatus }
          : student
      ));
    } catch (error) {
      console.error('Error al cambiar estado del estudiante:', error);
      setError('Error al cambiar el estado del estudiante');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Estudiantes</h1>
          <p className="text-gray-600 mt-1">
            Administra los estudiantes registrados en la plataforma
          </p>
        </div>
        <Link
          to="/admin/students/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus />
          Nuevo Estudiante
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
              <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            </div>
            <FaUsers className="text-3xl text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Estudiantes Activos</p>
              <p className="text-2xl font-bold text-green-600">
                {students.filter(s => s.status === 'active' || !s.status).length}
              </p>
            </div>
            <FaEye className="text-3xl text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cursos Completados</p>
              <p className="text-2xl font-bold text-purple-600">
                {students.reduce((sum, s) => sum + (s.completedCourses || 0), 0)}
              </p>
            </div>
            <FaGraduationCap className="text-3xl text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-yellow-600">
                {formatCurrency(students.reduce((sum, s) => sum + (s.totalSpent || 0), 0))}
              </p>
            </div>
            <FaDollarSign className="text-3xl text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Lista de Estudiantes ({filteredStudents.length})</h2>
        </div>
        
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No se encontraron estudiantes' : 'No hay estudiantes'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza agregando tu primer estudiante'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link
                to="/admin/students/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
              >
                <FaPlus />
                Agregar Primer Estudiante
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('displayName')}
                  >
                    <div className="flex items-center gap-1">
                      Estudiante
                      <FaSort className="text-xs" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cursos
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('totalSpent')}
                  >
                    <div className="flex items-center gap-1">
                      Gastos
                      <FaSort className="text-xs" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('lastAccess')}
                  >
                    <div className="flex items-center gap-1">
                      Actividad
                      <FaSort className="text-xs" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                            <img 
                              src={getGravatarUrl(student.email, 96)} 
                              alt={student.displayName || 'Estudiante'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback si Gravatar falla
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold" style={{display: 'none'}}>
                              {student.displayName ? student.displayName.charAt(0).toUpperCase() : 'E'}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.displayName || 'Sin nombre'}
                          </div>
                          <div className="text-sm text-gray-500">
                            Registrado: {formatDate(student.joinDate || student.createdAt)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <FaEnvelope className="text-xs text-gray-400" />
                          <span className="truncate max-w-xs">{student.email}</span>
                        </div>
                        {student.phone && (
                          <div className="flex items-center gap-1">
                            <FaPhone className="text-xs text-gray-400" />
                            <span>{student.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <FaGraduationCap className="text-xs text-blue-500" />
                          <span>{student.enrolledCourses || 0} inscritos</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs">
                            {student.completedCourses || 0} completados
                          </span>
                        </div>
                        {student.averageProgress && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full"
                              style={{ width: `${student.averageProgress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-semibold text-green-600">
                        {formatCurrency(student.totalSpent || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="text-xs text-gray-400" />
                          <span>{formatDate(student.lastAccess)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(student.id, student.status || 'active')}
                        className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                          (student.status || 'active') === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        } transition-colors`}
                        disabled={student.id === 'test-user-123'}
                      >
                        {(student.status || 'active') === 'active' ? (
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
                          to={`/admin/students/edit/${student.id}`}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                          title="Editar estudiante"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(student.id, student.displayName)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar estudiante"
                          disabled={student.id === 'test-user-123'}
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

export default StudentManager;