import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const useBlogPosts = (options = {}) => {
  const {
    publishedOnly = true,
    limitCount = null,
    category = null
  } = options;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let constraints = [];
        
        // Filtros básicos
        if (publishedOnly) {
          constraints.push(where('status', '==', 'Publicado'));
        }
        
        if (category && category !== 'all') {
          constraints.push(where('category', '==', category));
        }

        // Ordenamiento por fecha
        constraints.push(orderBy('date', 'desc'));

        // Límite si se especifica
        if (limitCount) {
          constraints.push(limit(limitCount));
        }

        const postsQuery = query(collection(db, 'posts'), ...constraints);
        const querySnapshot = await getDocs(postsQuery);
        
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setPosts(postsData);
      } catch (err) {
        console.error("Error al cargar publicaciones del blog:", err);
        setError(err.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [publishedOnly, limitCount, category]);

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

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let constraints = [];
      
      if (publishedOnly) {
        constraints.push(where('status', '==', 'Publicado'));
      }
      
      if (category && category !== 'all') {
        constraints.push(where('category', '==', category));
      }

      constraints.push(orderBy('date', 'desc'));

      if (limitCount) {
        constraints.push(limit(limitCount));
      }

      const postsQuery = query(collection(db, 'posts'), ...constraints);
      const querySnapshot = await getDocs(postsQuery);
      
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPosts(postsData);
    } catch (err) {
      console.error("Error al cargar publicaciones del blog:", err);
      setError(err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    posts,
    loading,
    error,
    formatDate,
    refetch
  };
};

export default useBlogPosts;