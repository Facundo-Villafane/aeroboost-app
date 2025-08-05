
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
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{selectedTag ? `${selectedTag} | Blog CODISEA` : `Blog de Programación | CODISEA`}</title>
        <meta 
          name="description" 
          content={selectedTag 
            ? `Artículos sobre ${selectedTag} en programación y tecnología. Contenido educativo para estudiantes de programación.` 
            : `Mantente actualizado con las últimas noticias y artículos sobre programación y tecnología. Blog especializado para estudiantes y profesionales.`
          } 
        />
        <meta 
          name="keywords" 
          content={`blog programación, educación tecnológica, noticias tech${selectedTag ? `, ${selectedTag}` : ''}`}
        />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-primary text-white py-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestro Blog</h1>
          <p className="text-xl max-w-2xl">
            Descubre artículos, tutoriales y noticias sobre programación y tecnología
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {selectedTag && (
          <div className="mb-6 bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center">
              <span className="mr-2 text-gray-700">Filtrando por:</span>
              <div className="bg-primary text-white rounded-full px-4 py-2 flex items-center">
                <span>{selectedTag}</span>
                <button 
                  onClick={clearTagFilter}
                  className="ml-2 text-white hover:text-gray-200 text-xl leading-none"
                >
                  &times;
                </button>
              </div>
            </div>
          </div>
        )}
        
        {loading || isSearching ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              {searchTerm ? `No hay resultados para "${searchTerm}"` : 'Aún no hay publicaciones'}
            </h3>
            <p className="text-gray-600 mb-6">
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
                className="px-6 py-3 bg-primary text-white rounded-full hover:bg-accent transition-colors font-semibold"
              >
                Ver todas las publicaciones
              </button>
            )}
          </div>
        ) : (
            <div className="space-y-6">
              {posts.map(post => (
                <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                      <h2 className="text-2xl font-bold text-primary mb-3">
                        <Link to={`/blog/${post.id}`} className="hover:text-accent transition-colors">
                          {post.title}
                        </Link>
                      </h2>
                      
                      <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
                        <div className="flex items-center mr-4 mb-2">
                          <FaCalendarAlt className="mr-2 text-secondary" />
                          <span>{formatDate(post.date)}</span>
                        </div>
                        
                        <div className="flex items-center mr-4 mb-2">
                          <FaUser className="mr-2 text-secondary" />
                          <span>{post.author}</span>
                        </div>
                        
                        <div className="flex items-center mb-2">
                          <FaEye className="mr-2 text-secondary" />
                          <span>{post.views || 0} lecturas</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="mb-4 flex flex-wrap">
                          {post.tags.map(tag => (
                            <Link 
                              key={tag} 
                              to={`/blog?tag=${tag}`}
                              className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full mr-2 mb-2 hover:bg-secondary hover:text-white transition-colors"
                            >
                              <FaTag className="inline mr-1" />
                              {tag}
                            </Link>
                          ))}
                        </div>
                      )}
                      
                      <Link 
                        to={`/blog/${post.id}`}
                        className="inline-flex items-center px-4 py-2 bg-primary text-white font-semibold rounded-full hover:bg-accent transition-colors"
                      >
                        Leer más
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
                    className="px-8 py-3 bg-primary text-white font-semibold rounded-full hover:bg-accent transition-colors disabled:opacity-70"
                  >
                    {loading ? 'Cargando...' : 'Cargar más artículos'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          {/* Búsqueda */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-primary mb-4">Buscar</h3>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar artículos..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-primary text-white rounded-full hover:bg-accent transition-colors"
                >
                  <FaSearch />
                </button>
              </div>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    fetchPosts();
                  }}
                  className="mt-3 text-sm text-primary hover:underline"
                >
                  Limpiar búsqueda
                </button>
              )}
            </form>
          </div>
          
          {/* Etiquetas */}
          {allTags.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Etiquetas</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Link 
                    key={tag}
                    to={`/blog?tag=${tag}`}
                    className={`${
                      selectedTag === tag 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-secondary hover:text-white'
                    } text-sm px-3 py-2 rounded-full transition-colors font-medium`}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Suscripción */}
          <div className="bg-gradient-to-br from-primary to-accent text-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">¡Suscríbete!</h3>
            <p className="mb-4 opacity-90">
              Recibe los últimos artículos y tutoriales directamente en tu correo.
            </p>
            
            {subscriptionStatus === 'success' && (
              <div className="bg-green-500 bg-opacity-20 border border-green-300 text-white px-4 py-3 rounded-lg mb-4">
                ¡Te has suscrito correctamente! Gracias por ser parte de nuestra comunidad.
              </div>
            )}
            
            {subscriptionStatus === 'existing' && (
              <div className="bg-yellow-500 bg-opacity-20 border border-yellow-300 text-white px-4 py-3 rounded-lg mb-4">
                Este correo ya está suscrito a nuestro newsletter.
              </div>
            )}
            
            {subscriptionStatus === 'error' && (
              <div className="bg-red-500 bg-opacity-20 border border-red-300 text-white px-4 py-3 rounded-lg mb-4">
                Ha ocurrido un error. Por favor, inténtalo de nuevo.
              </div>
            )}
            
            <form className="space-y-3" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="w-full px-4 py-3 text-gray-900 rounded-full border-2 border-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="w-full px-4 py-3 bg-secondary text-primary font-bold rounded-full hover:bg-yellow-400 transition-colors disabled:opacity-70 flex items-center justify-center"
              >
                {isSubscribing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
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
  </div>
  );
};

export default BlogPage;
