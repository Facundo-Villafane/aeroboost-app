
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router';
import { useAuth } from './AuthProvider';
import { FaLock, FaUser, FaArrowLeft, FaCode, FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (currentUser) {
      navigate('/admin/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // No es necesario navegar aquí - el efecto anterior se encargará
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      let errorMessage = 'Error al iniciar sesión. Por favor intenta de nuevo.';
      
      // Mensajes más específicos para errores comunes
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Usuario o contraseña incorrectos.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Demasiados intentos fallidos. Por favor, intenta más tarde.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden relative">
      {/* Geometric background patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-300/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-cyan-300/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-white/15 rounded-full blur-xl"></div>
      </div>

      {/* Floating code elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 text-white text-xl font-mono font-bold opacity-30"
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          {'<Admin />'}
        </motion.div>
        <motion.div
          className="absolute bottom-32 right-32 text-cyan-300 text-lg font-mono opacity-25"
          animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        >
          {'{ auth: true }'}
        </motion.div>
      </div>
      
      <div className="flex items-center justify-center min-h-screen px-4 relative z-10">
        <motion.div 
          className="max-w-md w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {/* Logo/Brand */}
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-white/15 backdrop-blur-sm rounded-2xl mb-6 border border-white/20"
              whileHover={{ scale: 1.05 }}
            >
              <h1 className="text-2xl font-bold text-white brand-font">CODISEA</h1>
            </motion.div>
            
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              Panel Administrativo
            </h2>
            <p className="text-white/80 text-sm">
              Accede al sistema de gestión de la academia
            </p>
          </motion.div>

          {/* Form Container */}
          <motion.div
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {error && (
              <motion.div 
                className="bg-red-500/20 border border-red-400/30 text-red-100 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                    placeholder="admin@codisea.dev"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-blue-600 py-4 px-6 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <FaRocket />
                    Acceder al Panel
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Back Link */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              <FaArrowLeft />
              Volver al sitio principal
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;