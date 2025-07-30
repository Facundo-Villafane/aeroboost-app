
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { FaBlog, FaUser, FaCalendarAlt, FaArrowRight, FaCode, FaSpinner } from 'react-icons/fa';

const BlogPreview = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("DIAGNÓSTICO BLOG: Iniciando consulta");
        
        // Consulta para obtener los 3 posts más recientes que estén publicados
        const postsQuery = query(
          collection(db, 'posts'),
          where('status', '==', 'Publicado'),
          orderBy('date', 'desc'),
          limit(3)
        );
        
        console.log("DIAGNÓSTICO BLOG: Query creada");
        
        const querySnapshot = await getDocs(postsQuery);
        
        console.log("DIAGNÓSTICO BLOG: Snapshot obtenido, número de docs:", querySnapshot.docs.length);
        
        // Verificar si hay documentos
        if (querySnapshot.empty) {
          console.log("DIAGNÓSTICO BLOG: No se encontraron documentos con status='Publicado'");
          
          // Verificar todos los posts independientemente del status
          const allPostsQuery = query(
            collection(db, 'posts'),
            limit(10)
          );
          
          const allPostsSnapshot = await getDocs(allPostsQuery);
          console.log("DIAGNÓSTICO BLOG: Número total de posts (cualquier status):", allPostsSnapshot.docs.length);
          
          // Verificar status de todos los posts
          allPostsSnapshot.docs.forEach((doc, index) => {
            const data = doc.data();
            console.log(`DIAGNÓSTICO BLOG: Post ${index + 1} - ID: ${doc.id}, Status: "${data.status}", Título: "${data.title}"`);
            console.log(`DIAGNÓSTICO BLOG: Post ${index + 1} - Fecha:`, data.date);
          });
          
          setBlogPosts([]);
        } else {
          // Logs para posts encontrados
          const posts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          console.log("DIAGNÓSTICO BLOG: Posts encontrados:", posts.length);
          posts.forEach((post, index) => {
            console.log(`DIAGNÓSTICO BLOG: Post ${index + 1} - ID: ${post.id}, Título: "${post.title}"`);
            console.log(`DIAGNÓSTICO BLOG: Post ${index + 1} - Fecha: ${post.date ? (post.date.seconds ? 'Timestamp válido' : 'Formato inválido') : 'Sin fecha'}`);
          });
          
          setBlogPosts(posts);
        }
      } catch (error) {
        console.error("DIAGNÓSTICO BLOG: Error específico:", error);
        console.error("Error al cargar las publicaciones del blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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

  // Pruebas para formatDate
  console.log("DIAGNÓSTICO BLOG: Prueba formatDate con fecha actual:", formatDate(new Date()));
  console.log("DIAGNÓSTICO BLOG: Prueba formatDate con timestamp:", formatDate({seconds: Math.floor(Date.now() / 1000), nanoseconds: 0}));
  console.log("DIAGNÓSTICO BLOG: Prueba formatDate con null:", formatDate(null));

  return (
    <section className="py-16 bg-dark-bg">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaBlog className="text-3xl text-secondary" />
            <h2 className="text-4xl font-bold text-light">Blog de Programación</h2>
          </div>
          <p className="text-xl text-gray-400 mb-2">
            Últimas noticias, tutoriales y consejos del mundo tech
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Mantente al día con las tendencias en programación, tecnología educativa 
            y recursos para jóvenes desarrolladores
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mb-4"
            >
              <FaSpinner className="text-4xl text-secondary" />
            </motion.div>
            <p className="text-gray-400">Cargando artículos...</p>
          </div>
        ) : blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div 
                key={post.id}
                className="bg-card-bg rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-secondary group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={post.coverImage || '/blog/default-post.jpg'} 
                    alt={post.title} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                    <FaCode className="inline mr-1" />
                    Programación
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-lightText mb-3">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt className="text-secondary" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaUser className="text-secondary" />
                      <span>{post.author}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-lightText mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <Link 
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-complementary font-semibold hover:text-secondary transition-colors duration-300 group-hover:translate-x-1 transform"
                  >
                    Leer artículo completo
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center py-16 bg-card-bg rounded-2xl shadow-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <FaBlog className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-primary mb-3">
                ¡Próximamente contenido increíble!
              </h3>
              <p className="text-lightText max-w-md mx-auto leading-relaxed">
                Estamos preparando artículos fantásticos sobre programación, tutoriales paso a paso 
                y consejos para jóvenes desarrolladores. ¡Vuelve pronto!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
              <div className="bg-primary/10 p-4 rounded-xl">
                <FaCode className="text-2xl text-secondary mx-auto mb-2" />
                <p className="text-sm text-darkText font-medium">Tutoriales de Código</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-xl">
                <FaBlog className="text-2xl text-secondary mx-auto mb-2" />
                <p className="text-sm text-darkText font-medium">Noticias Tech</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-xl">
                <FaUser className="text-2xl text-secondary mx-auto mb-2" />
                <p className="text-sm text-darkText font-medium">Historias de Éxito</p>
              </div>
            </div>
          </motion.div>
        )}

        {blogPosts.length > 0 && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link 
              to="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FaBlog />
              Ver todos los artículos
              <FaArrowRight />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BlogPreview;