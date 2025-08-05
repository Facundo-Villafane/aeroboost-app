
import { Navigate, Link } from 'react-router';
import { useAuth } from './AuthProvider';
import { useRole } from '../hooks/useRole';
import { clearStudentSession } from '../utils/auth';
import { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaArrowLeft, FaUserGraduate } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ProtectedRoute = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  
  try {
    const { currentUser, loading: authLoading } = useAuth();
    const { hasAdminAccess, loading: roleLoading, userRole, isStudent } = useRole();

    useEffect(() => {
      // Dar un poco más de tiempo para que se inicialice correctamente
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }, []);

    // Mostrar loading mientras se inicializa
    if (authLoading || roleLoading || !isReady) {
      return (
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
          <p className="text-white text-lg font-medium">Verificando permisos...</p>
        </div>
      );
    }

    // Redirigir al login si no hay usuario
    if (!currentUser) {
      console.log('No hay usuario autenticado, redirigiendo a login...');
      return <Navigate to="/admin/login" replace />;
    }

    // Mostrar página de acceso denegado si es estudiante
    if (isStudent || !hasAdminAccess) {
      console.log(`Acceso denegado. Rol del usuario: ${userRole}`);
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center px-4">
          <motion.div 
            className="max-w-md w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500/20 backdrop-blur-sm rounded-2xl mb-6 border border-yellow-400/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <FaExclamationTriangle className="text-3xl text-yellow-300" />
            </motion.div>
            
            <motion.h1 
              className="text-2xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Acceso Restringido
            </motion.h1>
            
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-white/90 mb-3">
                Esta área está reservada para administradores e instructores.
              </p>
              <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
                <FaUserGraduate />
                <span>Rol actual: {userRole === 'student' ? 'Estudiante' : userRole}</span>
              </div>
            </motion.div>

            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link 
                to="/student/dashboard"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <FaUserGraduate />
                Ir al Portal Estudiantil
              </Link>
              
              <button
                onClick={async () => {
                  // Cerrar sesión de estudiante y redirigir al login admin
                  await clearStudentSession();
                  window.location.href = '/admin/login';
                }}
                className="w-full bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-xl font-semibold transition-colors border border-white/30"
              >
                Iniciar Sesión como Admin
              </button>
              
              <Link 
                to="/"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium mt-4"
              >
                <FaArrowLeft />
                Volver al sitio principal
              </Link>
            </motion.div>
          </motion.div>
        </div>
      );
    }

    console.log(`Usuario autenticado con rol: ${userRole} - Acceso permitido`);
    return children;
  } catch (error) {
    console.error("Error en ProtectedRoute:", error);
    return <Navigate to="/admin/login" replace />;
  }
};

export default ProtectedRoute;