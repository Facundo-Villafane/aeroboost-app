import { useState, useEffect } from 'react';
import { doc, getDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../admin/AuthProvider';

export const useRole = () => {
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!currentUser) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        // Si es el usuario mock de estudiante, establecer rol de estudiante
        if (currentUser.uid === 'test-user-123') {
          setUserRole('student');
          setLoading(false);
          return;
        }

        // Primero intenta buscar el documento donde el ID es el UID del usuario
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserRole(userData.role || 'student');
        } else {
          // Si no existe un documento con ese ID, intenta buscar donde uid == currentUser.uid
          const userDocs = await getDocs(
            query(collection(db, 'users'), where('uid', '==', currentUser.uid))
          );
          
          if (!userDocs.empty) {
            const userData = userDocs.docs[0].data();
            setUserRole(userData.role || 'student');
          } else {
            // Si no se encuentra el usuario en la base de datos, asumir que es estudiante
            setUserRole('student');
          }
        }
      } catch (error) {
        console.error('Error al verificar rol:', error);
        setError(error.message);
        setUserRole('student'); // Por defecto, asumir estudiante en caso de error
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [currentUser]);

  const isFounder = userRole === 'founder';
  const isInstructor = userRole === 'instructor';
  const isStudent = userRole === 'student';
  const hasAdminAccess = isFounder || isInstructor;

  return {
    userRole,
    loading,
    error,
    isFounder,
    isInstructor,
    isStudent,
    hasAdminAccess
  };
};