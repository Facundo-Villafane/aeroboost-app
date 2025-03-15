
import md5 from 'md5'; 

// Función para generar la URL de Gravatar basada en el email
export const getGravatarUrl = (email, size = 100) => {
  if (!email) return '';
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
};

// Función para cargar el script de Gravatar desde UNPKG
export const loadGravatarScript = () => {
  return new Promise((resolve, reject) => {
    // Verificar si ya está cargado
    if (window.Gravatar) {
      console.log('Script de Gravatar ya está cargado');
      resolve(window.Gravatar);
      return;
    }
    
    // Cargar el script de UNPKG
    const script = document.createElement('script');
    // Usar la última versión disponible
    script.src = 'https://unpkg.com/@gravatar-com/quick-editor@latest';
    script.async = true;
    
    script.onload = () => {
      console.log('Script de Gravatar cargado correctamente');
      resolve(window.Gravatar);
    };
    
    script.onerror = (e) => {
      console.error('Error al cargar el script de Gravatar:', e);
      reject(new Error('No se pudo cargar el script de Gravatar'));
    };
    
    document.head.appendChild(script);
  });
};