import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Helmet } from 'react-helmet';
import { useAuth } from '../admin/AuthProvider';
import { 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaGraduationCap,
  FaGoogle,
  FaSpinner
} from 'react-icons/fa';

const StudentLogin = () => {
  const [email, setEmail] = useState('estudiante@test.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/student/dashboard');
    } catch {
      setError('Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex items-center justify-center px-4">
      <Helmet>
        <title>Iniciar Sesión | Estudiante CODISEA</title>
        <meta name="description" content="Accede a tu dashboard de estudiante" />
      </Helmet>

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <FaGraduationCap className="text-2xl text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Bienvenido</h1>
          <p className="text-gray-600">Accede a tu dashboard de estudiante</p>
        </div>

        {/* Demo User Info */}
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6">
          <div className="text-sm">
            <p className="font-semibold mb-1">👨‍🎓 Usuario de prueba:</p>
            <p><strong>Email:</strong> estudiante@test.com</p>
            <p><strong>Contraseña:</strong> 123456</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                key="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white"
                placeholder="tu@email.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                key="password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 bg-white"
                placeholder="Tu contraseña"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">o</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Login (placeholder) */}
        <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
          <FaGoogle className="text-red-500" />
          Continuar con Google
        </button>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/student/register" className="text-primary hover:text-accent font-semibold">
              Regístrate aquí
            </Link>
          </p>
          <Link to="/student/forgot-password" className="text-sm text-gray-500 hover:text-primary">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="text-gray-500 hover:text-primary transition-colors inline-flex items-center gap-2"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;