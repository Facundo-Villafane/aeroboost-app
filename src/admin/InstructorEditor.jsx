
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { doc, getDoc, setDoc, collection, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebase';
import { FaSave, FaSpinner, FaArrowLeft, FaUserTie } from 'react-icons/fa';
import { getGravatarUrl, loadGravatarScript } from '../utils/gravatar';

const InstructorEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id && id !== 'new';
  const [isFounder, setIsFounder] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [gravatarLoaded, setGravatarLoaded] = useState(false);

  const [instructor, setInstructor] = useState({
    displayName: '',
    email: '',
    role: 'instructor',
    specialty: '',
    experience: '',
    createdBy: auth.currentUser?.uid
  });

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkFounderRole();
    
    if (isEditMode) {
      fetchInstructor();
    } else {
      // En modo creación, aseguramos que el estado esté limpio
      setInstructor({
        displayName: '',
        email: '',
        role: 'instructor',
        specialty: '',
        experience: '',
        createdBy: auth.currentUser?.uid
      });
      setError('');
    }
  }, [id, isEditMode]);

  // Cargar el script de Gravatar al montar el componente en modo edición
  useEffect(() => {
    if (isEditMode && instructor.email && !gravatarLoaded) {
      loadGravatarScript()
        .then(() => {
          console.log('Gravatar cargado y listo para usar');
          setGravatarLoaded(true);
        })
        .catch(error => {
          console.error('Error al cargar Gravatar:', error);
        });
    }
  }, [isEditMode, instructor.email, gravatarLoaded]);

  // Verificar si el correo ya existe cuando cambia
  useEffect(() => {
    if (!isEditMode && instructor.email) {
      checkEmailExists(instructor.email);
    }
  }, [instructor.email, isEditMode]);

  const checkEmailExists = async (email) => {
    try {
      const emailQuery = await getDocs(
        query(collection(db, 'users'), where('email', '==', email))
      );
      
      const exists = !emailQuery.empty;
      setEmailExists(exists);
      
      if (exists) {
        console.log("El correo ya existe en la base de datos");
      }
      
      return exists;
    } catch (error) {
      console.error("Error al verificar el correo:", error);
      return false;
    }
  };

  const checkFounderRole = async () => {
    try {
      if (auth.currentUser) {
        console.log("Verificando rol para:", auth.currentUser.uid);
        
        // Primero intenta buscar el documento donde el ID es el UID del usuario
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log("Datos del usuario:", userData);
          setIsFounder(userData.role === 'founder');
          console.log("¿Es fundador?", userData.role === 'founder');
        } else {
          // Si no existe un documento con ese ID, intenta buscar donde uid == auth.currentUser.uid
          console.log("No se encontró documento con ID igual al UID, buscando por campo uid");
          const userDocs = await getDocs(
            query(collection(db, 'users'), where('uid', '==', auth.currentUser.uid))
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

  // Verificar si un email existe en Auth pero no en Firestore
  const handleAuthWithoutFirestore = async () => {
    try {
      setLoading(true);
      
      // Si el correo actual es el mismo que el del usuario autenticado
      if (instructor.email === auth.currentUser?.email) {
        // Obtener el UID actual
        const currentUid = auth.currentUser.uid;
        
        console.log("El usuario existe en Auth pero no en Firestore, creando documento...");
        
        // Crear un nuevo documento en Firestore para este usuario
        const gravatarUrl = getGravatarUrl(instructor.email, 200);
        
        const userData = {
          uid: currentUid,
          email: instructor.email,
          displayName: instructor.displayName || auth.currentUser.displayName || 'Usuario',
          role: instructor.role || 'founder', // Por defecto, asignar rol de fundador
          photoURL: gravatarUrl,
          specialty: instructor.specialty || '',
          experience: instructor.experience || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        // Guardar en Firestore usando el UID como ID del documento
        await setDoc(doc(db, 'users', currentUid), userData);
        
        console.log("Documento creado exitosamente para el usuario Auth existente");
        
        // Redireccionar a la lista de instructores
        navigate('/admin/instructors');
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al crear documento para usuario Auth:", error);
      setError("Error al crear documento para usuario existente: " + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructor = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const instructorData = docSnap.data();
        setInstructor(instructorData);
      } else {
        setError('El instructor no existe');
        navigate('/admin/instructors');
      }
    } catch (error) {
      console.error('Error al cargar instructor:', error);
      setError('Error al cargar instructor');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInstructor(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!instructor.displayName.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    
    if (!isEditMode && !instructor.email.trim()) {
      setError('El correo electrónico es obligatorio');
      return;
    }
    
    // Solo validar contraseña si es un usuario nuevo
    if (!isEditMode && !emailExists && !password.trim()) {
      setError('La contraseña es obligatoria para nuevos instructores');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let uid = instructor.uid;
      
      // Determinar la URL del avatar de Gravatar
      const gravatarUrl = instructor.email ? 
        getGravatarUrl(instructor.email, 200) : 
        '';

      // Si estamos creando un nuevo instructor y no somos fundadores, verificamos permisos
      if (!isEditMode && !isFounder) {
        setError('No tienes permisos para crear instructores');
        setLoading(false);
        return;
      }

      // Verificar de nuevo si el correo ya existe (por seguridad)
      if (!isEditMode) {
        const exists = await checkEmailExists(instructor.email);
        
        if (exists) {
          // Obtener el UID del usuario existente
          const existingUserQuery = await getDocs(
            query(collection(db, 'users'), where('email', '==', instructor.email))
          );
          
          if (!existingUserQuery.empty) {
            const existingUserData = existingUserQuery.docs[0].data();
            uid = existingUserData.uid || existingUserQuery.docs[0].id;
            console.log("Usando usuario existente:", uid);
          }
        } else if (!password.trim()) {
          // Si no existe y no hay contraseña, mostrar error
          setError('La contraseña es obligatoria para nuevos instructores');
          setLoading(false);
          return;
        }
      }

      // Si es una creación de usuario nuevo, crearlo en Firebase Auth
      if (!isEditMode && !emailExists) {
        try {
          console.log("Creando nuevo usuario en Firebase Auth");
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            instructor.email,
            password
          );
          uid = userCredential.user.uid;
        } catch (authError) {
          // Si el error es que el usuario ya existe, manejarlo adecuadamente
          if (authError.code === 'auth/email-already-in-use') {
            console.log("El correo ya está en uso en Auth, pero no en Firestore");
            
            // Si es el correo del usuario actual, intentar crear el documento
            if (instructor.email === auth.currentUser?.email) {
              const success = await handleAuthWithoutFirestore();
              if (success) return; // Si se manejó exitosamente, salir
            }
            
            // Si llegamos aquí, mostrar el error normal
            setError(`El correo ${instructor.email} ya existe en el sistema de autenticación pero no en la base de datos. Contacta al administrador.`);
            setLoading(false);
            return;
          } else {
            console.error('Error al crear usuario:', authError);
            setError(`Error al crear usuario: ${authError.message}`);
            setLoading(false);
            return;
          }
        }
      }

      // Preparar los datos del instructor
      const instructorData = {
        ...instructor,
        photoURL: gravatarUrl,
        uid: uid, // Aseguramos que uid esté definido
        updatedAt: serverTimestamp()
      };

      if (isEditMode) {
        // Actualizar instructor existente
        await setDoc(doc(db, 'users', id), instructorData, { merge: true });
      } else if (emailExists) {
        // Actualizar usuario existente
        console.log("Actualizando usuario existente en Firestore:", uid);
        await setDoc(doc(db, 'users', uid), {
          ...instructorData,
          role: instructor.role, // Asegurar que el rol se actualice
          specialty: instructor.specialty,
          experience: instructor.experience,
          displayName: instructor.displayName,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } else {
        // Crear nuevo instructor
        console.log("Creando nuevo documento en Firestore para:", uid);
        instructorData.createdAt = serverTimestamp();
        await setDoc(doc(db, 'users', uid), instructorData);
      }

      navigate('/admin/instructors');
    } catch (error) {
      console.error('Error al guardar instructor:', error);
      setError('Error al guardar instructor: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para abrir el editor de Gravatar
  const openGravatarEditor = async () => {
    if (!instructor.email) {
      alert('Se necesita un correo electrónico para editar el perfil de Gravatar');
      return;
    }
    
    setLoading(true);
    
    try {
      // Asegurarse de que el script esté cargado
      if (!gravatarLoaded) {
        await loadGravatarScript();
        setGravatarLoaded(true);
      }
      
      // Crear y abrir el editor
      if (window.Gravatar && window.Gravatar.GravatarQuickEditorCore) {
        const editor = new window.Gravatar.GravatarQuickEditorCore({
          email: instructor.email,
          scope: ['avatars'], // Solo permitir editar el avatar
          onProfileUpdated: (type) => {
            console.log('Perfil de Gravatar actualizado:', type);
            
            // Si se actualizó el avatar, actualizar la imagen
            if (type === 'avatar_updated') {
              const avatarImg = document.getElementById('instructor-avatar');
              if (avatarImg) {
                const timestamp = new Date().getTime(); // Para evitar el caché
                avatarImg.src = `${getGravatarUrl(instructor.email, 200)}&t=${timestamp}`;
              }
            }
          },
          onOpened: () => {
            console.log('Editor de Gravatar abierto');
            setLoading(false);
          },
          onClosed: () => {
            console.log('Editor de Gravatar cerrado');
            setLoading(false);
          }
        });
        
        const opened = editor.open();
        if (!opened) {
          throw new Error('No se pudo abrir el editor de Gravatar');
        }
      } else {
        throw new Error('El editor de Gravatar no está disponible');
      }
    } catch (error) {
      console.error('Error al abrir el editor de Gravatar:', error);
      setLoading(false);
      
      // Ofrecer alternativa de redirección a Gravatar.com
      if (window.confirm('No se pudo abrir el editor de Gravatar. ¿Deseas ir directamente a Gravatar.com?')) {
        window.open('https://gravatar.com/login/', '_blank');
        alert(
          'Instrucciones para actualizar tu avatar:\n\n' +
          '1. Inicia sesión en Gravatar con tu cuenta asociada al email ' + instructor.email + '\n' +
          '2. Ve a "Mis Gravatars"\n' +
          '3. Selecciona o sube una nueva imagen\n' +
          '4. Guarda los cambios\n' +
          '5. Regresa a esta página y recarga para ver los cambios'
        );
      }
    }
  };

  // Si no eres fundador y estás intentando editar un fundador, redirigir
  useEffect(() => {
    if (isEditMode && instructor.role === 'founder' && !isFounder) {
      navigate('/admin/instructors');
    }
  }, [instructor.role, isFounder, isEditMode, navigate]);

  if (loading && isEditMode && !instructor.displayName) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate('/admin/instructors')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-semibold">
            {isEditMode ? 'Editar Instructor' : 'Nuevo Instructor'}
          </h2>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex flex-col">
            <p>{error}</p>
            
            {/* Mostrar botón de solución rápida si es error de email en Auth pero sin Firestore */}
            {error.includes('ya existe en el sistema de autenticación pero no en la base de datos') && 
            instructor.email === auth.currentUser?.email && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleAuthWithoutFirestore}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                  Crear mi perfil automáticamente
                </button>
                <p className="text-xs text-red-600 mt-1">
                  Esto creará un documento para tu usuario existente en el sistema.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6 flex flex-col md:flex-row">
          <div className="mb-4 md:mb-0 md:mr-6 flex-shrink-0 flex flex-col items-center">
            {isEditMode ? (
              <>
                <div className="w-32 h-32 mb-2 relative">
                  <img
                    id="instructor-avatar"
                    src={getGravatarUrl(instructor.email, 200)}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover border-4 border-gray-200"
                  />
                </div>
                <div id="avatar-button-container" className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={openGravatarEditor}
                    className="mt-2 text-primary hover:text-blue-700 text-sm font-medium"
                  >
                    Modificar foto de perfil
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    Se abrirá en Gravatar.com
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-32 h-32 mb-2 flex items-center justify-center bg-gray-100 rounded-full">
                  <FaUserTie size={48} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Se usará el avatar de Gravatar
                </p>
                <p className="text-xs text-gray-500 text-center mt-1">
                  Basado en el email proporcionado
                </p>
              </>
            )}
          </div>
          
          <div className="flex-grow">
            <div className="mb-4">
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={instructor.displayName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Nombre del instructor"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={instructor.email}
                  onChange={handleChange}
                  required
                  disabled={isEditMode} // No permitir cambiar el email en modo edición
                  className={`w-full px-4 py-2 border ${
                    emailExists && !isEditMode ? 'border-yellow-400' : 'border-gray-300'
                  } rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-500`}
                  placeholder="correo@ejemplo.com"
                />
                {emailExists && !isEditMode && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-yellow-500">⚠️</span>
                  </div>
                )}
              </div>
              {isEditMode ? (
                <p className="text-xs text-gray-500 mt-1">El correo electrónico no se puede modificar una vez creado.</p>
              ) : emailExists ? (
                <p className="text-xs text-yellow-600 mt-1">
                  Este correo ya existe en el sistema. Si continúas, se actualizará el usuario existente.
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Se usará para obtener el avatar de Gravatar y para inicio de sesión.</p>
              )}
            </div>
          </div>
        </div>

        {!isEditMode && !emailExists && (
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!emailExists} // Solo requerido si el correo no existe
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Contraseña para el nuevo instructor"
            />
          </div>
        )}

        {!isEditMode && emailExists && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-700">
              <strong>Nota:</strong> Estás modificando un usuario existente. No se requiere contraseña y 
              no se creará una nueva cuenta en el sistema.
            </p>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
            Especialidad
          </label>
          <input
            type="text"
            id="specialty"
            name="specialty"
            value={instructor.specialty}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="Ej: Meteorología, Navegación, Sistemas de Aeronaves"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
            Experiencia
          </label>
          <textarea
            id="experience"
            name="experience"
            value={instructor.experience}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="Breve descripción de la experiencia profesional"
          ></textarea>
        </div>

        {isFounder && (
          <div className="mb-6">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              id="role"
              name="role"
              value={instructor.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            >
              <option value="instructor">Instructor</option>
              <option value="founder">Fundador</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Los fundadores tienen permisos completos para gestionar el sistema.
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin/instructors')}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-100 transition-colors mr-4"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center"
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
            {loading ? 'Guardando...' : 'Guardar instructor'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InstructorEditor;