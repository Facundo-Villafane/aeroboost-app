
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';

// Crear el contexto
const AuthContext = createContext(null);

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Usuario de prueba mock
const MOCK_USER = {
  uid: 'test-user-123',
  email: 'estudiante@test.com',
  displayName: 'Juan Pérez',
  emailVerified: true
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar primero si hay usuario mock guardado
    const savedMockUser = localStorage.getItem('mockUser');
    if (savedMockUser) {
      try {
        const user = JSON.parse(savedMockUser);
        if (user.uid === 'test-user-123') {
          setCurrentUser(user);
          setLoading(false);
          return;
        }
      } catch (error) {
        localStorage.removeItem('mockUser');
      }
    }

    // Suscribirse a los cambios de autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Solo actualizar si no hay usuario mock
      if (!localStorage.getItem('mockUser')) {
        setCurrentUser(user);
      }
      setLoading(false);
    });

    // Limpiar la suscripción al desmontar
    return unsubscribe;
  }, []);

  // Función de login con usuario de prueba
  const login = async (email, password) => {
    try {
      // Si es el usuario de prueba, simular login exitoso
      if (email === 'estudiante@test.com' && password === '123456') {
        setCurrentUser(MOCK_USER);
        // Guardar en localStorage para persistencia
        localStorage.setItem('mockUser', JSON.stringify(MOCK_USER));
        return Promise.resolve({ user: MOCK_USER });
      }
      
      // Si no es el usuario de prueba, usar Firebase Auth
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      // Si es usuario mock, limpiar localStorage
      if (currentUser?.uid === 'test-user-123') {
        localStorage.removeItem('mockUser');
        setCurrentUser(null);
        return;
      }
      
      // Si es usuario real, usar Firebase signOut
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  };

  // Valor que se proveerá al contexto
  const value = {
    currentUser,
    user: currentUser, // Alias para compatibilidad
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;