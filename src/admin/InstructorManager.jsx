
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  where,
  getDoc
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaUserTie } from 'react-icons/fa';
import { getGravatarUrl } from '../utils/gravatar';

const InstructorManager = () => {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const currentUser = auth.currentUser;
  const [isFounder, setIsFounder] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    fetchInstructors();
    checkFounderRole();
  }, []);

// Reemplaza la función checkFounderRole con esta versión
const checkFounderRole = async () => {
    try {
      if (currentUser) {
        console.log("Verificando rol para:", currentUser.uid);
        
        // Primero intenta buscar el documento donde el ID es el UID del usuario
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log("Datos del usuario:", userData);
          setIsFounder(userData.role === 'founder');
          console.log("¿Es fundador?", userData.role === 'founder');
        } else {
          // Si no existe un documento con ese ID, intenta buscar donde uid == currentUser.uid
          console.log("No se encontró documento con ID igual al UID, buscando por campo uid");
          const userDocs = await getDocs(
            query(collection(db, 'users'), where('uid', '==', currentUser.uid))
          );
          
          if (!userDocs.empty) {
            const userData = userDocs.docs[0].data();
            console.log("Datos del usuario (por campo uid):", userData);
            setIsFounder(userData.role === 'founder');
            console.log("¿Es fundador?", userData.role === 'founder');
          } else {
            console.log("No se encontró ningún documento para este usuario");
          }
        }
      }
    } catch (error) {
      console.error('Error al verificar rol:', error);
    }
  };

  const fetchInstructors = async (search = '') => {
    setLoading(true);
    try {
      let instructorsQuery;
      
      if (search) {
        instructorsQuery = query(
          collection(db, 'users'),
          where('displayName', '>=', search),
          where('displayName', '<=', search + '\uf8ff'),
          orderBy('displayName')
        );
      } else {
        instructorsQuery = query(
          collection(db, 'users'),
          orderBy('displayName')
        );
      }
      
      const snapshot = await getDocs(instructorsQuery);
      
      const instructorsList = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Asegurar que cada instructor tenga una URL de Gravatar actualizada
        if (data.email) {
          data.photoURL = getGravatarUrl(data.email, 100);
        }
        
        return {
          id: doc.id,
          ...data
        };
      });
      
      setInstructors(instructorsList);
      // Marcar que ya se ha completado la carga inicial
      setInitialLoadComplete(true);
    } catch (error) {
      console.error('Error al cargar instructores:', error);
      // Marcar que ya se ha completado la carga inicial incluso si hay error
      setInitialLoadComplete(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInstructors(searchTerm);
  };

  const handleAddInstructor = () => {
    navigate('/admin/instructors/new');
  };

  const handleEditInstructor = (id) => {
    navigate(`/admin/instructors/edit/${id}`);
  };

  const handleDeleteInstructor = async (id) => {
    // Solo los fundadores pueden eliminar instructores
    if (!isFounder) {
      alert('No tienes permisos para realizar esta acción');
      return;
    }
    
    if (window.confirm('¿Estás seguro de que deseas eliminar este instructor?')) {
      try {
        await deleteDoc(doc(db, 'users', id));
        setInstructors(instructors.filter(instructor => instructor.id !== id));
      } catch (error) {
        console.error('Error al eliminar instructor:', error);
        alert('Error al eliminar instructor');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Gestión de Equipo Docente</h2>
        {isFounder && (
          <button
            onClick={handleAddInstructor}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" /> Nuevo Instructor
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="flex mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar instructores..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-primary focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 text-gray-600 hover:text-gray-900"
            >
              <FaSearch />
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              fetchInstructors('');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 transition-colors"
          >
            Limpiar
          </button>
        </form>

        {loading || !initialLoadComplete ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-500 text-lg">Cargando instructores...</p>
          </div>
        ) : instructors.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No hay instructores registrados.</p>
            {isFounder && (
              <button
                onClick={handleAddInstructor}
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Agregar primer instructor
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map((instructor) => (
              <div key={instructor.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-200 flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    {instructor.photoURL ? (
                      <img 
                        src={instructor.photoURL} 
                        alt={instructor.displayName} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                        <FaUserTie size={20} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{instructor.displayName}</h3>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      instructor.role === 'founder' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {instructor.role === 'founder' ? 'Fundador' : 'Instructor'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  {instructor.specialty && (
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">Especialidad:</span> {instructor.specialty}
                    </p>
                  )}
                  {instructor.experience && (
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">Experiencia:</span> {instructor.experience}
                    </p>
                  )}
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Email:</span> {instructor.email}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => handleEditInstructor(instructor.id)}
                    className="text-blue-600 hover:text-blue-900 p-1 mr-2"
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  {isFounder && instructor.role !== 'founder' && (
                    <button
                      onClick={() => handleDeleteInstructor(instructor.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorManager;