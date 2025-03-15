import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  getDoc
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { FaPlus, FaSearch, FaEdit, FaEye, FaTrash, FaLock } from 'react-icons/fa';

const BlogManager = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [postsPerPage] = useState(10);
  const [isFounder, setIsFounder] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    checkUserRole();
    fetchPosts();
  }, []);

  const checkUserRole = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setCurrentUserId(currentUser.uid);
        
        // Primero intenta buscar el documento donde el ID es el UID del usuario
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setIsFounder(userData.role === 'founder');
        } else {
          // Si no existe un documento con ese ID, intenta buscar donde uid == currentUser.uid
          const userDocs = await getDocs(
            query(collection(db, 'users'), where('uid', '==', currentUser.uid))
          );
          
          if (!userDocs.empty) {
            const userData = userDocs.docs[0].data();
            setIsFounder(userData.role === 'founder');
          }
        }
      }
    } catch (error) {
      console.error('Error al verificar rol:', error);
    }
  };

  const fetchPosts = async (search = '') => {
    setLoading(true);
    try {
      let postsQuery;
      
      if (search) {
        postsQuery = query(
          collection(db, 'posts'),
          where('title', '>=', search),
          where('title', '<=', search + '\uf8ff'),
          orderBy('title'),
          limit(postsPerPage)
        );
      } else {
        postsQuery = query(
          collection(db, 'posts'),
          orderBy('date', 'desc'),
          limit(postsPerPage)
        );
      }
      
      const snapshot = await getDocs(postsQuery);
      
      if (snapshot.empty) {
        setPosts([]);
        setHasMore(false);
      } else {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Añadir campo que indique si el usuario actual puede editar este post
          canEdit: isFounder || doc.data().authorId === currentUserId
        }));
        
        setPosts(docs);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === postsPerPage);
      }
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar posts cuando cambia isFounder o currentUserId
  useEffect(() => {
    if (posts.length > 0) {
      // Actualizar el campo canEdit para cada post
      const updatedPosts = posts.map(post => ({
        ...post,
        canEdit: isFounder || post.authorId === currentUserId
      }));
      setPosts(updatedPosts);
    }
  }, [isFounder, currentUserId]);

  const fetchMorePosts = async () => {
    if (!lastVisible) return;
    
    setLoading(true);
    try {
      const postsQuery = query(
        collection(db, 'posts'),
        orderBy('date', 'desc'),
        startAfter(lastVisible),
        limit(postsPerPage)
      );
      
      const snapshot = await getDocs(postsQuery);
      
      if (snapshot.empty) {
        setHasMore(false);
      } else {
        const newDocs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Añadir campo que indique si el usuario actual puede editar este post
          canEdit: isFounder || doc.data().authorId === currentUserId
        }));
        
        setPosts(prev => [...prev, ...newDocs]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === postsPerPage);
      }
    } catch (error) {
      console.error('Error al cargar más publicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(searchTerm);
  };

  const handleCreateNew = () => {
    navigate('/admin/blog/new');
  };

  const handleEditPost = (id) => {
    navigate(`/admin/blog/edit/${id}`);
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      try {
        await deleteDoc(doc(db, 'posts', id));
        setPosts(posts.filter(post => post.id !== id));
      } catch (error) {
        console.error('Error al eliminar la publicación:', error);
        alert('Error al eliminar la publicación');
      }
    }
  };

  

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Gestión del Blog</h2>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" /> Nueva publicación
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="flex mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar publicaciones..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-primary focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 text-gray-600 hover:text-gray-900"
            >
              <FaSearch />
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              fetchPosts('');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 transition-colors"
          >
            Limpiar
          </button>
        </form>

        {loading && posts.length === 0 ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando publicaciones...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No se encontraron publicaciones.</p>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Crear primera publicación
            </button>
          </div>
        ) : (
          <>
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
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {post.excerpt}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{post.author}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {post.date ? new Date(post.date instanceof Date ? post.date : post.date.seconds * 1000).toLocaleDateString() : 'Sin fecha'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          post.status === 'Publicado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        {post.canEdit ? (
                          <>
                            <button
                              onClick={() => handleEditPost(post.id)}
                              className="text-blue-600 hover:text-blue-900 mx-2"
                              title="Editar"
                            >
                              <FaEdit />
                            </button>
                            <Link
                              to={`/blog/${post.id}`}
                              className="text-green-600 hover:text-green-900 mx-2"
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Ver"
                            >
                              <FaEye />
                            </Link>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-600 hover:text-red-900 mx-2"
                              title="Eliminar"
                            >
                              <FaTrash />
                            </button>
                          </>
                        ) : (
                          <>
                            <span 
                              className="text-gray-400 mx-2 cursor-not-allowed"
                              title="No tienes permisos para editar esta publicación"
                            >
                              <FaLock />
                            </span>
                            <Link
                              to={`/blog/${post.id}`}
                              className="text-green-600 hover:text-green-900 mx-2"
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Ver"
                            >
                              <FaEye />
                            </Link>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {hasMore && (
              <div className="text-center mt-6">
                <button
                  onClick={fetchMorePosts}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Cargando...' : 'Cargar más'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogManager;