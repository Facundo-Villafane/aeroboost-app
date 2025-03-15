
import { Navigate } from 'react-router';
import { useAuth } from './AuthProvider';

const ProtectedRoute = ({ children }) => {
  try {
    const { currentUser, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="ml-3 text-lg text-gray-600">Cargando...</p>
        </div>
      );
    }

    if (!currentUser) {
      return <Navigate to="/admin/login" />;
    }

    return children;
  } catch (error) {
    console.error("Error en ProtectedRoute:", error);
    return <Navigate to="/admin/login" />;
  }
};

export default ProtectedRoute;