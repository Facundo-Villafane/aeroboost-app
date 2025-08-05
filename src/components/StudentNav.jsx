import { Link, useLocation } from 'react-router';
import { useAuth } from '../admin/AuthProvider';
import { getGravatarUrl } from '../utils/gravatar';
import { 
  FaHome, 
  FaBookOpen, 
  FaShoppingCart, 
  FaUser, 
  FaSignOutAlt,
  FaGraduationCap
} from 'react-icons/fa';

const StudentNav = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/student/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/student/profile', label: 'Mi Perfil', icon: FaUser }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/student/dashboard" className="flex items-center gap-3">
            <FaGraduationCap className="text-2xl text-primary" />
            <span className="text-xl font-bold text-primary">CODISEA Student</span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                }`}
              >
                <item.icon />
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* Aula Virtual Button */}
            <a
              href="https://aula.codisea.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-secondary text-primary rounded-full hover:bg-yellow-400 transition-colors font-semibold"
            >
              <FaGraduationCap />
              Aula Virtual
            </a>

            <div className="hidden md:flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary">
                <img 
                  src={getGravatarUrl(user?.email, 64)} 
                  alt={user?.displayName || 'Estudiante'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback si Gravatar falla
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-bold" style={{display: 'none'}}>
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'E'}
                </div>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-800">{user?.displayName || 'Estudiante'}</div>
                <div className="text-gray-700">Estudiante</div>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-red-600 transition-colors"
              title="Cerrar sesión"
            >
              <FaSignOutAlt />
              <span className="hidden md:inline">Salir</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex justify-around py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'text-primary bg-blue-50'
                    : 'text-gray-700'
                }`}
              >
                <item.icon className="text-lg" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
            
            {/* Aula Virtual Mobile */}
            <a
              href="https://aula.codisea.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors text-secondary"
            >
              <FaGraduationCap className="text-lg" />
              <span className="text-xs font-medium">Aula</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StudentNav;