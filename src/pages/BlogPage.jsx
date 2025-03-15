
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Helmet } from 'react-helmet';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { FaCalendarAlt, FaUser, FaTag, FaEye, FaSearch } from 'react-icons/fa';

const BlogPage = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [allTags, setAllTags] = useState([]);
  
  // Estados para el buscador
  const [isSearching, setIsSearching] = useState(false);
  
  // Estados para la suscripción
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Asegurar que la página se muestre desde el principio
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Extraer tag de la URL si existe
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagParam = params.get('tag');
    if (tagParam) {
      setSelectedTag(tagParam);
    }
  }, [location]);

  // Cargar posts
  useEffect(() => {
    fetchPosts();
    fetchAllTags();
  }, [selectedTag]);

  const fetchPosts = async (startAfterDoc = null) => {
    setLoading(true);
    try {
      let postsQuery;
      
      if (selectedTag) {
        postsQuery = query(
          collection(db, 'posts'),
          where('status', '==', 'Publicado'),
          where('tags', 'array-contains', selectedTag),
          orderBy('date', 'desc'),
          limit(6)
        );
      } else {
        postsQuery = query(
          collection(db, 'posts'),
          where('status', '==', 'Publicado'),
          orderBy('date', 'desc'),
          limit(6)
        );
      }
      
      if (startAfterDoc) {
        postsQuery = query(postsQuery, startAfter(startAfterDoc));
      }
      
      const snapshot = await getDocs(postsQuery);
      
      if (snapshot.empty) {
        if (!startAfterDoc) {
          setPosts([]);
        }
        setHasMore(false);
      } else {
        const loadedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (startAfterDoc) {
          setPosts(prev => [...prev, ...loadedPosts]);
        } else {
          setPosts(loadedPosts);
        }
        
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === 6);
      }
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = () => {
    if (lastVisible) {
      fetchPosts(lastVisible);
    }
  };

  const fetchAllTags = async () => {
    try {
      const postsQuery = query(
        collection(db, 'posts'),
        where('status', '==', 'Publicado')
      );
      
      const snapshot = await getDocs(postsQuery);
      
      const tagsSet = new Set();
      snapshot.docs.forEach(doc => {
        const post = doc.data();
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach(tag => tagsSet.add(tag));
        }
      });
      
      setAllTags(Array.from(tagsSet));
    } catch (error) {
      console.error('Error al cargar etiquetas:', error);
    }
  };

  // Implementación de la búsqueda
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      // Búsqueda por título que contenga el término de búsqueda
      // Firebase no tiene búsqueda de texto completo nativa, esta es una aproximación simple
      const titleStartsWithQuery = query(
        collection(db, 'posts'),
        where('status', '==', 'Publicado'),
        where('title', '>=', searchTerm),
        where('title', '<=', searchTerm + '\uf8ff'),
        orderBy('title'),
        limit(10)
      );
      
      const snapshot = await getDocs(titleStartsWithQuery);
      
      // También podríamos buscar en el contenido o extracto
      const titleContainsResults = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPosts(titleContainsResults);
      
      // Resetear el paginado
      setHasMore(false);
      setLastVisible(null);
    } catch (error) {
      console.error('Error al buscar:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Implementación de la suscripción
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setSubscriptionStatus('error');
      return;
    }
    
    setIsSubscribing(true);
    try {
      // Crear una colección de suscriptores en Firestore
      const subscribersRef = collection(db, 'subscribers');
      
      // Verificar si el email ya está suscrito
      const emailExistsQuery = query(subscribersRef, where('email', '==', email));
      const emailSnapshot = await getDocs(emailExistsQuery);
      
      if (!emailSnapshot.empty) {
        setSubscriptionStatus('existing');
        setIsSubscribing(false);
        return;
      }
      
      // Agregar el nuevo suscriptor
      await addDoc(subscribersRef, {
        email,
        subscribedAt: serverTimestamp(),
        active: true
      });
      
      setSubscriptionStatus('success');
      setEmail('');
      
      // Limpiar el mensaje después de 5 segundos
      setTimeout(() => {
        setSubscriptionStatus('');
      }, 5000);
    } catch (error) {
      console.error('Error al suscribirse:', error);
      setSubscriptionStatus('error');
    } finally {
      setIsSubscribing(false);
    }
  };

  const formatDate = (dateData) => {
    if (!dateData) return 'Fecha no disponible';
    
    let date;
    if (typeof dateData === 'string') {
      date = new Date(dateData);
    } else if (dateData.seconds) {
      // Firestore Timestamp
      date = new Date(dateData.seconds * 1000);
    } else {
      date = new Date(dateData);
    }
      
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const clearTagFilter = () => {
    setSelectedTag('');
    window.history.pushState({}, '', '/blog');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>{selectedTag ? `${selectedTag} | Blog AeroBoost` : `Blog de Aviación | AeroBoost Learning Center`}</title>
        <meta 
          name="description" 
          content={selectedTag 
            ? `Artículos sobre ${selectedTag} en el mundo aeronáutico. Las últimas noticias y tendencias para profesionales y estudiantes de aviación.` 
            : `Mantente actualizado con las últimas noticias y artículos sobre la industria aeronáutica. Blog especializado para estudiantes y profesionales de la aviación.`
          } 
        />
        <meta 
          name="keywords" 
          content={`blog aviación, formación aeronáutica, noticias sector aeronáutico${selectedTag ? `, ${selectedTag}` : ''}`}
        />
      </Helmet>
      <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Nuestro Blog</h1>
      <p className="text-xl text-gray-600">
        Mantente actualizado con las últimas noticias y artículos sobre la industria aeronáutica
      </p>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {selectedTag && (
          <div className="mb-6 flex items-center">
            <span className="mr-2">Filtrando por:</span>
            <div className="bg-primary text-white rounded-full px-3 py-1 flex items-center">
              <span>{selectedTag}</span>
              <button 
                onClick={clearTagFilter}
                className="ml-2 text-white hover:text-gray-200"
              >
                &times;
              </button>
            </div>
          </div>
        )}
        
        {loading || isSearching ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? `No hay resultados para "${searchTerm}"` : 'Aún no hay publicaciones'}
            </h3>
            <p className="text-gray-600">
              {selectedTag 
                ? `No hay publicaciones con la etiqueta "${selectedTag}".` 
                : searchTerm 
                  ? 'Intenta con otros términos o navega por las categorías disponibles.'
                  : 'No hay publicaciones disponibles en este momento. ¡Vuelve pronto para ver nuevo contenido!'}
            </p>
            {(selectedTag || searchTerm) && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  clearTagFilter();
                  fetchPosts();
                }}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Ver todas las publicaciones
              </button>
            )}
          </div>
        ) : (
            <div className="space-y-8">
              {posts.map(post => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="md:flex">
                    {post.coverImage && (
                      <div className="md:flex-shrink-0">
                        <img 
                          className="h-48 w-full md:w-48 object-cover" 
                          src={post.coverImage} 
                          alt={post.title} 
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        <Link to={`/blog/${post.id}`} className="hover:text-primary">
                          {post.title}
                        </Link>
                      </h2>
                      
                      <div className="flex flex-wrap items-center text-sm text-gray-600 mb-3">
                        <div className="flex items-center mr-4 mb-1">
                          <FaCalendarAlt className="mr-1" />
                          <span>{formatDate(post.date)}</span>
                        </div>
                        
                        <div className="flex items-center mr-4 mb-1">
                          <FaUser className="mr-1" />
                          <span>{post.author}</span>
                        </div>
                        
                        <div className="flex items-center mb-1">
                          <FaEye className="mr-1" />
                          <span>{post.views || 0} lecturas</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">
                        {post.excerpt}
                      </p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="mb-4 flex flex-wrap">
                          {post.tags.map(tag => (
                            <Link 
                              key={tag} 
                              to={`/blog?tag=${tag}`}
                              className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded mr-2 mb-1 hover:bg-gray-300 transition-colors"
                            >
                              <FaTag className="inline mr-1" />
                              {tag}
                            </Link>
                          ))}
                        </div>
                      )}
                      
                      <Link 
                        to={`/blog/${post.id}`}
                        className="inline-block text-primary font-medium hover:underline"
                      >
                        Leer más →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
              
              {hasMore && (
                <div className="text-center mt-8">
                  <button 
                    onClick={loadMorePosts}
                    disabled={loading}
                    className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
                  >
                    {loading ? 'Cargando...' : 'Cargar más artículos'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Buscar</h3>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar artículos..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
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
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    fetchPosts(); // Vuelve a cargar todos los posts
                  }}
                  className="mt-2 text-sm text-primary hover:underline"
                >
                  Limpiar búsqueda
                </button>
              )}
            </form>
          </div>
          
          {allTags.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Etiquetas</h3>
              <div className="flex flex-wrap">
                {allTags.map(tag => (
                  <Link 
                    key={tag}
                    to={`/blog?tag=${tag}`}
                    className={`${
                      selectedTag === tag 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    } text-sm px-3 py-1 rounded mr-2 mb-2 transition-colors`}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Suscríbete</h3>
            <p className="text-gray-600 mb-4">
              Recibe las últimas noticias y actualizaciones directamente en tu correo.
            </p>
            
            {subscriptionStatus === 'success' && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                ¡Te has suscrito correctamente! Gracias por ser parte de nuestra comunidad.
              </div>
            )}
            
            {subscriptionStatus === 'existing' && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                Este correo ya está suscrito a nuestro newsletter.
              </div>
            )}
            
            {subscriptionStatus === 'error' && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                Ha ocurrido un error. Por favor, inténtalo de nuevo.
              </div>
            )}
            
            <form className="space-y-3" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="w-full px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center"
              >
                {isSubscribing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </>
                ) : (
                  'Suscribirse'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
