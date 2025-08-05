import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const useCourses = (options = {}) => {
  const {
    featuredOnly = false,
    activeOnly = true,
    limit = null,
    category = null
  } = options;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let constraints = [];
        
        // Filtros básicos
        if (activeOnly) {
          constraints.push(where('status', '==', 'active'));
        }
        
        if (featuredOnly) {
          constraints.push(where('featured', '==', true));
        }
        
        if (category && category !== 'all') {
          constraints.push(where('category', '==', category));
        }

        // Ordenamiento
        constraints.push(orderBy('featured', 'desc'));
        constraints.push(orderBy('createdAt', 'desc'));

        const coursesQuery = query(collection(db, 'courses'), ...constraints);
        const querySnapshot = await getDocs(coursesQuery);
        
        let coursesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Aplicar límite si se especifica
        if (limit) {
          coursesData = coursesData.slice(0, limit);
        }

        setCourses(coursesData);
      } catch (err) {
        console.error("Error al cargar cursos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [featuredOnly, activeOnly, limit, category]);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let constraints = [];
      
      // Filtros básicos
      if (activeOnly) {
        constraints.push(where('status', '==', 'active'));
      }
      
      if (featuredOnly) {
        constraints.push(where('featured', '==', true));
      }
      
      if (category && category !== 'all') {
        constraints.push(where('category', '==', category));
      }

      // Ordenamiento
      constraints.push(orderBy('featured', 'desc'));
      constraints.push(orderBy('createdAt', 'desc'));

      const coursesQuery = query(collection(db, 'courses'), ...constraints);
      const querySnapshot = await getDocs(coursesQuery);
      
      let coursesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Aplicar límite si se especifica
      if (limit) {
        coursesData = coursesData.slice(0, limit);
      }

      setCourses(coursesData);
    } catch (err) {
      console.error("Error al cargar cursos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    courses,
    loading,
    error,
    refetch
  };
};

export default useCourses;