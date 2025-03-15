
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './admin/AuthProvider';

// Componentes de layout
import Header from './components/Header';
import Footer from './components/Footer';

// Páginas principales
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';


// Componentes de Administración
import Auth from './admin/Auth';
import Dashboard from './admin/Dashboard';
import DashboardHome from './admin/DashboardHome';
import BlogManager from './admin/BlogManager';
import BlogEditor from './admin/BlogEditor';
import CommentManager from './admin/CommentManager';
import ProtectedRoute from './admin/ProtectedRoute';
import InstructorManager from './admin/InstructorManager';
import InstructorEditor from './admin/InstructorEditor';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas del sitio */}
          <Route path="/" element={
            <MainLayout>
              <Home />
            </MainLayout>
          } />
          <Route path="/servicios" element={
            <MainLayout>
              <ServicesPage />
            </MainLayout>
          } />
          <Route path="/sobre-nosotros" element={
            <MainLayout>
              <AboutPage />
            </MainLayout>
          } />
          <Route path="/blog" element={
            <MainLayout>
              <BlogPage />
            </MainLayout>
          } />
          <Route path="/blog/:id" element={
            <MainLayout>
              <BlogPostPage />
            </MainLayout>
          } />
          <Route path="/contacto" element={
            <MainLayout>
              <ContactPage />
            </MainLayout>
          } />
          
          
          {/* Rutas de administración */}
          <Route path="/admin/login" element={<Auth />} />
          
          {/* Dashboard Admin y sub-rutas */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="blog" element={<BlogManager />} />
            <Route path="blog/new" element={<BlogEditor />} />
            <Route path="blog/edit/:id" element={<BlogEditor />} />
            <Route path="comments" element={<CommentManager />} />
            <Route path="instructors" element={<InstructorManager />} />
            <Route path="instructors/new" element={<InstructorEditor />} />
            <Route path="instructors/edit/:id" element={<InstructorEditor />} />
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
          
          {/* Redirecciones para rutas no encontradas */}
          <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={
            <MainLayout>
              <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">Página no encontrada</h1>
                <p className="text-lg text-gray-600 mb-8">Lo sentimos, la página que buscas no existe.</p>
                <a href="/" className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                  Volver al inicio
                </a>
              </div>
            </MainLayout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;