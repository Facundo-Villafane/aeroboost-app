import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export const clearStudentSession = async () => {
  try {
    // Limpiar localStorage
    localStorage.removeItem('mockUser');
    
    // Si hay una sesión de Firebase, cerrarla
    if (auth.currentUser) {
      await signOut(auth);
    }
    
    console.log('Sesión de estudiante limpiada');
  } catch (error) {
    console.error('Error al limpiar sesión:', error);
  }
};

export const getUserRoleFromStorage = () => {
  try {
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      const user = JSON.parse(mockUser);
      if (user.uid === 'test-user-123') {
        return 'student';
      }
    }
    return null;
  } catch (error) {
    console.error('Error al obtener rol del localStorage:', error);
    return null;
  }
};