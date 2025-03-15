
import { motion } from 'framer-motion';
import { Link } from 'react-router'; // Mantener esta importación para React Router v7
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

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
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-darkText mb-2">Últimas Publicaciones</h2>
          <p className="text-lightText">Mantente al día con las novedades del sector aeronáutico</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div 
                key={post.id}
                className="bg-white rounded-lg overflow-hidden shadow-md"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <img 
                  src={post.coverImage || '/blog/default-post.jpg'} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">{formatDate(post.date)} • Por {post.author}</div>
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-lightText mb-4">{post.excerpt}</p>
                  <Link 
                    to={`/blog/${post.id}`}
                    className="text-primary font-medium hover:underline"
                  >
                    Leer más →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center py-12 bg-gray-50 rounded-lg shadow"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aún no hay publicaciones disponibles
            </h3>
            <p className="text-gray-600">
              Estamos trabajando en contenido valioso para ti. ¡Vuelve pronto para ver nuestros artículos!
            </p>
          </motion.div>
        )}

        {blogPosts.length > 0 && (
          <div className="text-center mt-10">
            <Link 
              to="/blog"
              className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              Ver todas las publicaciones
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogPreview;