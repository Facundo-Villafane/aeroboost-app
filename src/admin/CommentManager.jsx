
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
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
import { db } from '../firebase';
import { FaSearch, FaTrash, FaEye } from 'react-icons/fa';

const CommentManager = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [commentsPerPage] = useState(20);
  const [postTitles, setPostTitles] = useState({});

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async (search = '') => {
    setLoading(true);
    try {
      let commentsQuery;
      
      if (search) {
        commentsQuery = query(
          collection(db, 'comments'),
          where('content', '>=', search),
          where('content', '<=', search + '\uf8ff'),
          orderBy('content'),
          limit(commentsPerPage)
        );
      } else {
        commentsQuery = query(
          collection(db, 'comments'),
          orderBy('createdAt', 'desc'),
          limit(commentsPerPage)
        );
      }
      
      const snapshot = await getDocs(commentsQuery);
      
      if (snapshot.empty) {
        setComments([]);
        setHasMore(false);
      } else {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setComments(docs);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === commentsPerPage);
        
        // Cargar los títulos de los posts
        const postIds = [...new Set(docs.map(comment => comment.postId))];
        fetchPostTitles(postIds);
      }
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostTitles = async (postIds) => {
    const titles = { ...postTitles };
    
    for (const postId of postIds) {
      if (!titles[postId]) {
        try {
          const postDoc = await getDoc(doc(db, 'posts', postId));
          if (postDoc.exists()) {
            titles[postId] = postDoc.data().title;
          } else {
            titles[postId] = 'Post no encontrado';
          }
        } catch (error) {
          console.error(`Error al cargar título del post ${postId}:`, error);
          titles[postId] = 'Error al cargar título';
        }
      }
    }
    
    setPostTitles(titles);
  };

  const fetchMoreComments = async () => {
    if (!lastVisible) return;
    
    setLoading(true);
    try {
      const commentsQuery = query(
        collection(db, 'comments'),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(commentsPerPage)
      );
      
      const snapshot = await getDocs(commentsQuery);
      
      if (snapshot.empty) {
        setHasMore(false);
      } else {
        const newDocs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setComments(prev => [...prev, ...newDocs]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === commentsPerPage);
        
        // Cargar los títulos de los posts
        const postIds = [...new Set(newDocs.map(comment => comment.postId))];
        fetchPostTitles(postIds);
      }
    } catch (error) {
      console.error('Error al cargar más comentarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchComments(searchTerm);
  };

  const handleDeleteComment = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
      try {
        await deleteDoc(doc(db, 'comments', id));
        setComments(comments.filter(comment => comment.id !== id));
      } catch (error) {
        console.error('Error al eliminar el comentario:', error);
        alert('Error al eliminar el comentario');
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return new Date(timestamp).toLocaleString('es-ES');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Gestión de Comentarios</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="flex mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar comentarios..."
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
              fetchComments('');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 transition-colors"
          >
            Limpiar
          </button>
        </form>

        {loading && comments.length === 0 ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando comentarios...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No se encontraron comentarios.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comentario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Publicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {comments.map((comment) => (
                    <tr key={comment.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {comment.content}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">{comment.userName}</div>
                          <div className="text-sm text-gray-500">{comment.userEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-blue-600 hover:text-blue-900">
                          <Link to={`/blog/${comment.postId}`} target="_blank">
                            {postTitles[comment.postId] || 'Cargando...'}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <Link
                          to={`/blog/${comment.postId}`}
                          className="text-green-600 hover:text-green-900 mx-2"
                          target="_blank"
                          title="Ver en contexto"
                        >
                          <FaEye />
                        </Link>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-600 hover:text-red-900 mx-2"
                          title="Eliminar"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {hasMore && (
              <div className="text-center mt-6">
                <button
                  onClick={fetchMoreComments}
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

export default CommentManager;