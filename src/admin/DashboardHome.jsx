import { FaNewspaper, FaUsers, FaEye, FaComments } from 'react-icons/fa';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    totalComments: 0,
    recentPosts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Obtener número total de posts
        const postsSnapshot = await getDocs(collection(db, 'posts'));
        const totalPosts = postsSnapshot.size;
        
        // Obtener número total de usuarios (asumiendo que tienes una colección de usuarios)
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnapshot.size;

        // Obtener número total de comentarios
        const commentsSnapshot = await getDocs(collection(db, 'comments'));
        const totalComments = commentsSnapshot.size;
        
        // Obtener 5 posts más recientes
        const recentPostsQuery = query(
          collection(db, 'posts'),
          orderBy('date', 'desc'),
          limit(5)
        );
        const recentPostsSnapshot = await getDocs(recentPostsQuery);
        const recentPosts = recentPostsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setStats({
          totalPosts,
          totalUsers,
          totalComments,
          recentPosts
        });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Panel de control</h2>
      
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-primary mr-4">
              <FaNewspaper className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Total de publicaciones</p>
              {loading ? (
                <div className="h-8 flex items-center">
                  <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div>
                </div>
              ) : (
                <p className="text-2xl font-semibold">{stats.totalPosts}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaUsers className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Total de usuarios</p>
              {loading ? (
                <div className="h-8 flex items-center">
                  <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div>
                </div>
              ) : (
                <p className="text-2xl font-semibold">{stats.totalUsers}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FaComments className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Total de comentarios</p>
              {loading ? (
                <div className="h-8 flex items-center">
                  <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div>
                </div>
              ) : (
                <p className="text-2xl font-semibold">{stats.totalComments}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaEye className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Vistas este mes</p>
              <p className="text-2xl font-semibold">0</p>
              <p className="text-xs text-gray-500 mt-1">Estadísticas próximamente</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Publicaciones recientes */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Publicaciones recientes</h3>
          <Link to="/admin/blog" className="text-primary hover:underline">
            Ver todas
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : stats.recentPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Autor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentPosts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {post.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{post.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(post.date instanceof Date ? post.date : post.date.seconds * 1000).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.status === 'Publicado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/blog/edit/${post.id}`}
                        className="text-primary hover:text-blue-800 mr-4"
                      >
                        Editar
                      </Link>
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-gray-600 hover:text-gray-900"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-md">
            <p className="text-gray-500 mb-4">Aún no hay publicaciones en el blog</p>
            <Link
              to="/admin/blog/new"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Crear primera publicación
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;