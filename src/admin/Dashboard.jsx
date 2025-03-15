
import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { FaHome, FaNewspaper, FaUserTie, FaBars, FaTimes, FaSignOutAlt, FaComments } from 'react-icons/fa';
import logoImage2 from '../assets/logo2.webp';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    // Cerrar el menú móvil cuando cambiamos de ruta
    setIsMobileMenuOpen(false);
  }, [location]);

  const menuItems = [
    { path: '/admin/dashboard', icon: <FaHome />, label: 'Inicio' },
    { path: '/admin/blog', icon: <FaNewspaper />, label: 'Blog' },
    { path: '/admin/comments', icon: <FaComments />, label: 'Comentarios' }, // Nuevo ítem para comentarios
    { path: '/admin/instructors', icon: <FaUserTie />, label: 'Instructores' },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar para escritorio */}
      <div
        className={`bg-gray-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition duration-200 ease-in-out z-30`}
      >
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <img src={logoImage2} alt="Aeroboost" className="h-8" />
            
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md bg-gray-800 md:hidden"
          >
            <FaTimes />
          </button>
        </div>

        <nav>
          <ul className="space-y-2 px-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 rounded-md p-3 ${
                    isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}

            <li className="pt-4 mt-4 border-t border-gray-700">
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-3 rounded-md p-3 text-gray-300 hover:bg-gray-700 w-full"
              >
                <FaSignOutAlt />
                <span>Cerrar sesión</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md bg-gray-100 text-gray-700 mr-4 hidden md:block"
            >
              <FaBars />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md bg-gray-100 text-gray-700 mr-4 md:hidden"
            >
              <FaBars />
            </button>
            <h1 className="text-xl font-semibold">Panel de Administración</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <span className="text-sm text-gray-500">
                {auth.currentUser?.email}
              </span>
            </div>

            <Link
              to="/"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver sitio
            </Link>
          </div>
        </header>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="bg-white shadow-lg rounded-b-lg p-4 md:hidden z-20">
            <ul className="space-y-3">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 p-2 rounded-md ${
                      isActive(item.path)
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contenido principal */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

