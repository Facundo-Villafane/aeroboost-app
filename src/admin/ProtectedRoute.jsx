
import { Navigate } from 'react-router';
import { useAuth } from './AuthProvider';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  
  try {
    const { currentUser, loading } = useAuth();

    useEffect(() => {
      // Dar un poco más de tiempo para que se inicialice correctamente
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }, []);

    // Mostrar loading mientras se inicializa
    if (loading || !isReady) {
      return (
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
          <p className="text-white text-lg font-medium">Verificando acceso...</p>
        </div>
      );
    }

    // Redirigir al login si no hay usuario
    if (!currentUser) {
      console.log('No hay usuario autenticado, redirigiendo a login...');
      return <Navigate to="/admin/login" replace />;
    }

    console.log('Usuario autenticado:', currentUser.email);
    return children;
  } catch (error) {
    console.error("Error en ProtectedRoute:", error);
    return <Navigate to="/admin/login" replace />;
  }
};

export default ProtectedRoute;