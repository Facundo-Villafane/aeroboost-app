
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Helmet } from 'react-helmet';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  increment, 
  collection, 
  query, 
  where, 
  limit, 
  getDocs,
  addDoc,
  orderBy,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { getGravatarUrl } from '../utils/gravatar';
import { db, auth } from '../firebase';
import { FaCalendarAlt, FaUser, FaTag, FaEye, FaArrowLeft, FaShare, FaFacebook, FaLinkedin, FaWhatsapp, FaLink, FaTimes } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedPosts, setRelatedPosts] = useState([]);
  
  // Estados para los comentarios
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentError, setCommentError] = useState('');

  // Estados para la información del autor
  const [authorInfo, setAuthorInfo] = useState(null);
  const [loadingAuthor, setLoadingAuthor] = useState(false);

  // Asegurar que la página se muestre desde el principio
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'posts', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const postData = { id: docSnap.id, ...docSnap.data() };
        setPost(postData);
        
        // Incrementar contador de vistas
        await updateDoc(docRef, {
          views: increment(1)
        });
        
        // Intentar cargar posts relacionados basados en tags
        if (postData.tags && postData.tags.length > 0) {
          fetchRelatedPosts(postData.tags, docSnap.id);
        }
      } else {
        setError('No se encontró la publicación');
      }
    } catch (error) {
      console.error('Error al cargar la publicación:', error);
      setError('Error al cargar la publicación');
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar la información del autor
  const fetchAuthorInfo = async () => {
    if (!post || !post.authorId) return;
    
    setLoadingAuthor(true);
    try {
      const authorDoc = await getDoc(doc(db, 'users', post.authorId));
      
      if (authorDoc.exists()) {
        const authorData = authorDoc.data();
        // Añadir la URL de Gravatar si existe el email
        if (authorData.email) {
          authorData.photoURL = getGravatarUrl(authorData.email, 200);
        }
        setAuthorInfo(authorData);
      } else {
        // Si no se encuentra el autor, usa la información básica del post
        setAuthorInfo({
          displayName: post.author,
          photoURL: getGravatarUrl(post.author.replace(/\s/g, '') + '@aeroboost.com', 200),
          specialty: 'Autor',
          experience: ''
        });
      }
    } catch (error) {
      console.error('Error al cargar información del autor:', error);
    } finally {
      setLoadingAuthor(false);
    }
  };

  // Cargar información del autor cuando se carga el post
  useEffect(() => {
    if (post) {
      fetchAuthorInfo();
    }
  }, [post]);

  const fetchRelatedPosts = async (tags, currentPostId) => {
    try {
      // Buscar posts que tengan al menos uno de los tags de este post
      const postsQuery = query(
        collection(db, 'posts'),
        where('tags', 'array-contains-any', tags.slice(0, 10)), // Firestore limita a 10 valores en array-contains-any
        where('status', '==', 'Publicado'),
        limit(3)
      );
      
      const querySnapshot = await getDocs(postsQuery);
      const relatedPostsData = [];
      
      querySnapshot.forEach(doc => {
        // No incluir el post actual en los relacionados
        if (doc.id !== currentPostId) {
          relatedPostsData.push({
            id: doc.id,
            ...doc.data()
          });
        }
      });
      
      setRelatedPosts(relatedPostsData);
    } catch (error) {
      console.error('Error al cargar posts relacionados:', error);
    }
  };

  // Función para cargar comentarios
  const fetchComments = async () => {
    if (!id) return;
    
    setLoadingComments(true);
    try {
      const commentsQuery = query(
        collection(db, 'comments'),
        where('postId', '==', id),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(commentsQuery);
      
      const commentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setComments(commentsData);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
    } finally {
      setLoadingComments(false);
    }
  };
  
  // Cargar comentarios cuando se carga el post
  useEffect(() => {
    if (post) {
      fetchComments();
    }
  }, [post]);
  
  // Función para manejar el envío de un nuevo comentario
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setCommentError('El comentario no puede estar vacío');
      return;
    }
    
    if (!userName.trim()) {
      setCommentError('Por favor, introduce tu nombre');
      return;
    }
    
    if (!userEmail.trim() || !userEmail.includes('@')) {
      setCommentError('Por favor, introduce un email válido');
      return;
    }
    
    setCommentError('');
    setLoadingComments(true);
    
    try {
      // Añadir el comentario a Firestore
      await addDoc(collection(db, 'comments'), {
        postId: id,
        content: newComment,
        userName,
        userEmail,
        createdAt: serverTimestamp()
      });
      
      // Limpiar el formulario
      setNewComment('');
      
      // Recargar comentarios
      fetchComments();
    } catch (error) {
      console.error('Error al añadir comentario:', error);
      setCommentError('Error al publicar el comentario. Inténtalo de nuevo.');
    } finally {
      setLoadingComments(false);
    }
  };
  
  // Función para formatear la fecha del comentario
  const formatCommentDate = (timestamp) => {
    if (!timestamp) return 'Hace un momento';
    
    const now = new Date();
    const commentDate = new Date(timestamp.seconds * 1000);
    const diffTime = Math.abs(now - commentDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return diffMinutes <= 1 ? 'Hace un momento' : `Hace ${diffMinutes} minutos`;
      }
      return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return commentDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };
  
  // Función para eliminar un comentario (opcional, solo para admins)
  const deleteComment = async (commentId) => {
    if (!commentId || !auth.currentUser) return;
    
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      try {
        await deleteDoc(doc(db, 'comments', commentId));
        fetchComments();
      } catch (error) {
        console.error('Error al eliminar comentario:', error);
      }
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      })
      .catch(err => console.error('Error al compartir:', err));
    } else {
      // Fallback para navegadores que no soportan Web Share API
      const url = window.location.href;
      navigator.clipboard.writeText(url)
        .then(() => alert('Enlace copiado al portapapeles'))
        .catch(err => console.error('Error al copiar enlace:', err));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Helmet>
          <title>Cargando artículo | Blog AeroBoost</title>
        </Helmet>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Helmet>
          <title>Artículo no encontrado | Blog AeroBoost</title>
        </Helmet>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {error || 'No se encontró la publicación'}
          </h2>
          <Link to="/blog" className="text-primary hover:underline">
            Volver al blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>{post.title} | AeroBoost Learning Center</title>
        <meta name="description" content={post.excerpt || `Lee sobre ${post.title} en nuestro blog especializado en formación aeronáutica.`} />
        {post.tags && post.tags.length > 0 && (
          <meta name="keywords" content={`${post.tags.join(', ')}, aviación, formación aeronáutica`} />
        )}
        {/* Tags para compartir en redes sociales */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ''} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        <meta property="og:type" content="article" />
      </Helmet>
      <div className="mb-6">
        <Link to="/blog" className="text-primary hover:underline flex items-center">
          <FaArrowLeft className="mr-2" /> Volver al blog
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            {post.coverImage && (
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="w-full h-64 md:h-80 object-cover"
              />
            )}
            
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
              
              <div className="flex flex-wrap items-center text-gray-600 mb-6">
                <div className="flex items-center mr-4 mb-2">
                  <FaCalendarAlt className="mr-1" />
                  <span>{formatDate(post.date)}</span>
                </div>
                
                <div className="flex items-center mr-4 mb-2">
                  <FaUser className="mr-1" />
                  <span>{post.author}</span>
                </div>
                
                <div className="flex items-center mr-4 mb-2">
                  <FaEye className="mr-1" />
                  <span>{post.views || 0} lecturas</span>
                </div>
                
                <button 
                  onClick={handleShare}
                  className="flex items-center text-primary hover:underline mb-2"
                >
                  <FaShare className="mr-1" />
                  <span>Compartir</span>
                </button>
              </div>
              
              {post.tags && post.tags.length > 0 && (
                <div className="mb-6 flex flex-wrap">
                  {post.tags.map(tag => (
                    <Link 
                      key={tag} 
                      to={`/blog?tag=${tag}`}
                      className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded mr-2 mb-2 hover:bg-gray-300 transition-colors"
                    >
                      <FaTag className="inline mr-1" />
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
              
              {post.excerpt && (
                <div className="text-lg text-gray-700 italic mb-6 border-l-4 border-primary pl-4 py-2 bg-gray-50">
                  {post.excerpt}
                </div>
              )}
              
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              ></div>
            </div>
          </article>
          
          {/* Botones para compartir en redes sociales */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Comparte este artículo</h3>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
                className="flex items-center px-4 py-2 bg-[#1DA1F2] text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                <FaXTwitter />
              </button>
              
              <button 
                onClick={() => window.open(`https://www.facebook.com/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="flex items-center px-4 py-2 bg-[#4267B2] text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                <FaFacebook />
              </button>
              
              <button 
                onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}&summary=${encodeURIComponent(post.excerpt || '')}`, '_blank')}
                className="flex items-center px-4 py-2 bg-[#0077B5] text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                <FaLinkedin />
              </button>
              
              <button 
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`, '_blank')}
                className="flex items-center px-4 py-2 bg-[#25D366] text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                <FaWhatsapp />
              </button>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Enlace copiado al portapapeles');
                }}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                <FaLink className="mr-2" /> Copiar enlace
              </button>
            </div>
          </div>

          {/* Sección de comentarios */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Comentarios ({comments.length})</h3>
            
            {/* Formulario para añadir comentario */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                  Deja tu comentario
                </label>
                <textarea
                  id="comment"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  placeholder="Escribe tu comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="Tu nombre"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="tu@email.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {commentError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {commentError}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loadingComments}
                className="px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                {loadingComments ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  'Publicar comentario'
                )}
              </button>
            </form>
            
            {/* Lista de comentarios */}
            {loadingComments && comments.length === 0 ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">{comment.userName}</div>
                      <div className="text-sm text-gray-500">
                        {formatCommentDate(comment.createdAt)}
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay comentarios todavía. ¡Sé el primero en comentar!</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          {/* Sección "Sobre el autor" mejorada */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Sobre el autor</h3>
            
            {loadingAuthor ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : authorInfo ? (
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <img 
                    src={authorInfo.photoURL || getGravatarUrl(post.author.replace(/\s/g, '') + '@aeroboost.com', 200)} 
                    alt={authorInfo.displayName || post.author}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">{authorInfo.displayName || post.author}</p>
                  {authorInfo.specialty && (
                    <p className="text-sm text-primary font-medium">{authorInfo.specialty}</p>
                  )}
                  {authorInfo.experience && (
                    <p className="text-sm text-gray-600 mt-1">{authorInfo.experience}</p>
                  )}
                  {!authorInfo.specialty && !authorInfo.experience && (
                    <p className="text-sm text-gray-600">Instructor</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xl">
                  {post.author ? post.author.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="ml-4">
                  <p className="font-medium">{post.author}</p>
                  <p className="text-sm text-gray-600">Autor</p>
                </div>
              </div>
            )}
          </div>
          
          {relatedPosts.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Publicaciones relacionadas</h3>
              <div className="space-y-4">
                {relatedPosts.map(relatedPost => (
                  <div key={relatedPost.id} className="flex items-start">
                    {relatedPost.coverImage && (
                      <img 
                        src={relatedPost.coverImage} 
                        alt={relatedPost.title}
                        className="w-20 h-16 object-cover rounded"
                      />
                    )}
                    <div className={relatedPost.coverImage ? "ml-3" : ""}>
                      <Link 
                        to={`/blog/${relatedPost.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {relatedPost.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(relatedPost.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;