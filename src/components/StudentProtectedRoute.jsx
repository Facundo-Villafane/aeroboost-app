import { useAuth } from '../admin/AuthProvider';
import { Navigate } from 'react-router';

const StudentProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/student/login" replace />;
  }

  return children;
};

export default StudentProtectedRoute;