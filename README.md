# AeroBoost App [View](https://aeroboost.com.ar/)

![Estado del Proyecto](https://img.shields.io/badge/Estado-En%20Desarrollo-brightgreen)
![Versión](https://img.shields.io/badge/Versión-1.0.0-blue)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green)

## 📚 Descripción

AeroBoost App es una plataforma web moderna diseñada para una institución educativa que brinda apoyo académico. La aplicación complementa un aula virtual en Moodle y sirve como punto central para promocionar servicios educativos, mientras proporciona contenido de valor a través de un sistema de blog gestionado por instructores certificados.

## ✨ Características Principales

### 🌐 Sitio Público
- **Página de Inicio**: Presentación principal de la institución y servicios destacados
- **Servicios**: Catálogo detallado de los servicios académicos ofrecidos
- **Sobre Nosotros**: Información institucional y equipo de instructores
- **Blog**: Artículos educativos con sistema de búsqueda y comentarios
- **Contacto**: Formulario para consultas y comunicación directa

### 👨‍💼 Panel de Administración
- **Autenticación**: Sistema de login seguro para instructores y administradores
- **Gestión de Usuarios**: Control de acceso y permisos (solo admin)
- **Editor de Blog**: Interfaz para crear y editar contenido con editor Quill
- **Gestión de Comentarios**: Moderación de comentarios de los artículos
- **Gestión de Instructores**: Administración de perfiles de instructores

## 🛠️ Tecnologías

### Frontend
- **React 19**: Biblioteca principal para la interfaz de usuario
- **Vite 6**: Herramienta de construcción y desarrollo
- **Tailwind CSS 4**: Framework de estilos utilitarios
- **React Router 7**: Gestión de navegación y rutas
- **React Helmet**: Manejo de metadatos dinámicos para SEO
- **Framer Motion**: Animaciones y transiciones fluidas
- **React Icons**: Biblioteca de iconos para la interfaz

### Backend y Servicios
- **Firebase 11**: 
  - Autenticación de usuarios
  - Base de datos en tiempo real
  - Almacenamiento de archivos
  
### Herramientas de Contenido
- **Quill 2.0**: Editor de texto enriquecido para el blog
- **Gravatar**: Servicio de avatares para perfiles de instructores y autores

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Facundo-Villafane/aeroboost-app.git

# Navegar al directorio del proyecto
cd aeroboost-app

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crea un archivo .env basado en .env.example con tus credenciales de Firebase y tu endpoint

# Iniciar el servidor de desarrollo
npm run dev
```

## 🚀 Estructura del Proyecto

```
/src
├── /admin              # Componentes del panel de administración
│   ├── Auth.jsx        # Componente de autenticación
│   ├── AuthProvider.jsx # Proveedor de contexto de autenticación
│   ├── Dashboard.jsx   # Dashboard principal
│   ├── BlogEditor.jsx  # Editor de entradas del blog
│   └── ...
├── /components         # Componentes reutilizables
│   ├── Header.jsx      # Encabezado del sitio
│   ├── Footer.jsx      # Pie de página
│   └── ...
├── /pages              # Páginas principales del sitio
│   ├── Home.jsx        # Página de inicio
│   ├── ServicesPage.jsx # Página de servicios
│   ├── BlogPage.jsx    # Página del blog
│   └── ...
├── /styles             # Estilos adicionales
├── /utils              # Utilidades y helpers
├── App.jsx             # Componente principal de la aplicación
└── main.jsx            # Punto de entrada
```

## 🔧 Scripts Disponibles

- **`npm run dev`**: Inicia el servidor de desarrollo
- **`npm run build`**: Construye la aplicación para producción
- **`npm run lint`**: Ejecuta el linter para verificar el código
- **`npm run preview`**: Previsualiza la versión de producción localmente

## 🔒 Configuración de Firebase

Para utilizar esta aplicación, necesitarás configurar un proyecto en Firebase:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita la autenticación, Firestore Database y Storage
3. Crea un archivo `firebase.js` en la carpeta `/src/utils/` con tu configuración:

```javascript

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Tu configuración de Firebase 
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};;

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener las instancias de los servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
```

## 👥 Roles de Usuario

- **Administrador**: Acceso completo al dashboard, puede crear usuarios y gestionar todos los aspectos del sitio
- **Instructor**: Puede crear y editar entradas del blog, moderar comentarios en sus propias publicaciones

## 📝 Características del Blog

- Editor Quill para crear contenido rico con imágenes, formato y más
- Sistema de categorías y etiquetas para organizar el contenido
- Búsqueda avanzada para encontrar artículos específicos
- Sistema de comentarios moderados
- Perfiles de autor con Gravatar

## 🌐 SEO y Metadatos

La aplicación utiliza React Helmet para gestionar metadatos dinámicos:
- Títulos personalizados para cada página
- Descripciones y palabras clave optimizadas
- Configuración para compartir en redes sociales (Open Graph)

## 📱 Responsive Design

La aplicación está diseñada para funcionar en todas las plataformas:
- Diseño adaptable para móviles, tablets y escritorio
- Implementado con Tailwind CSS para una experiencia fluida

## 📊 Rendimiento

- Optimizado con Vite para una carga rápida
- Código dividido para mejorar los tiempos de inicio
- Imágenes optimizadas y carga diferida

## 📫 Configuración del Formulario de Contacto

La aplicación utiliza un script PHP para procesar el formulario de contacto. Debes crear el siguiente archivo en tu servidor:

### Estructura de archivos
```
/public_html (o carpeta raíz)
├── /api
│   └── endpoint.php
```

### Contenido de endpoint en PHP
```php
<?php
// Permitir solicitudes desde el origen de tu aplicación React
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Función para sanitizar entradas
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Verificar que sea una solicitud POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener datos del formulario
    $name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
    $email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? sanitize_input($_POST['phone']) : '';
    $message = isset($_POST['message']) ? sanitize_input($_POST['message']) : '';
    
    // Validar datos básicos
    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode([
            'success' => false,
            'error' => 'Por favor, completa todos los campos requeridos.'
        ]);
        exit;
    }
    
    // Validar email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'success' => false,
            'error' => 'Por favor, proporciona un correo electrónico válido.'
        ]);
        exit;
    }
    
    // Configurar el destinatario del correo
    $to = "tu-email@dominio.com"; // Cambia esto a tu dirección de correo
    
    // Configurar el asunto
    $subject = "Nuevo mensaje de contacto desde el sitio web";
    
    // Configurar las cabeceras del correo
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: $name <$email>" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";
    
    // Configurar el cuerpo del mensaje
    $email_body = "
    <html>
    <head>
        <title>Nuevo mensaje de contacto</title>
    </head>
    <body>
        <h2>Nuevo mensaje de contacto desde el sitio web</h2>
        <table>
            <tr>
                <th style='text-align: left; padding: 8px;'>Nombre:</th>
                <td style='padding: 8px;'>$name</td>
            </tr>
            <tr>
                <th style='text-align: left; padding: 8px;'>Email:</th>
                <td style='padding: 8px;'>$email</td>
            </tr>
            <tr>
                <th style='text-align: left; padding: 8px;'>Teléfono:</th>
                <td style='padding: 8px;'>$phone</td>
            </tr>
            <tr>
                <th style='text-align: left; padding: 8px;'>Mensaje:</th>
                <td style='padding: 8px;'>$message</td>
            </tr>
        </table>
    </body>
    </html>
    ";
    
    // Intenta enviar el correo
    $mail_sent = mail($to, $subject, $email_body, $headers);
    
    // Verificar si el correo se envió correctamente
    if ($mail_sent) {
        // Respuesta exitosa
        echo json_encode([
            'success' => true,
            'message' => '¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.'
        ]);
    } else {
        // Error al enviar el correo
        echo json_encode([
            'success' => false,
            'error' => 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.'
        ]);
    }
} else {
    // Si no es una solicitud POST
    echo json_encode([
        'success' => false,
        'error' => 'Método no permitido'
    ]);
}
?>
```

> Nota: Asegúrate de cambiar `tu-email@dominio.com` por la dirección de correo electrónico donde deseas recibir los mensajes.

## 📄 Licencia

Este proyecto está licenciado bajo [MIT License](LICENSE)
