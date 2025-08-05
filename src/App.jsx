import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router';
import { AuthProvider } from './admin/AuthProvider';
import { CartProvider } from './contexts/CartContext';

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

// Páginas de estudiante
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import StudentLogin from './pages/StudentLogin';
import StudentLayout from './components/StudentLayout';
import StudentProtectedRoute from './components/StudentProtectedRoute';

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
import CourseManager from './admin/CourseManager';
import CourseEditor from './admin/CourseEditor';
import StudentManager from './admin/StudentManager';

// Nuevos componentes del sistema financiero
import FinancialModel from './admin/FinancialModel';
import InstructorServicesPanel from './admin/InstructorServicesPanel';
import ServiceRequestsSystem from './admin/ServiceRequestsSystem';
import FounderPaymentPanel from './admin/FounderPaymentPanel';

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
      <CartProvider>
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
          
          {/* Rutas de estudiante */}
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/dashboard" element={
            <StudentProtectedRoute>
              <StudentLayout>
                <StudentDashboard />
              </StudentLayout>
            </StudentProtectedRoute>
          } />
          <Route path="/student/profile" element={
            <StudentProtectedRoute>
              <StudentLayout>
                <StudentProfile />
              </StudentLayout>
            </StudentProtectedRoute>
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
            
            {/* Rutas de gestión de cursos */}
            <Route path="courses" element={<CourseManager />} />
            <Route path="courses/new" element={<CourseEditor />} />
            <Route path="courses/edit/:courseId" element={<CourseEditor />} />
            
            {/* Rutas de gestión de estudiantes */}
            <Route path="students" element={<StudentManager />} />
            
            {/* Nuevas rutas para el sistema financiero */}
            <Route path="financials" element={<FinancialModel />} />
            <Route path="instructor-services" element={<InstructorServicesPanel />} />
            <Route path="service-requests" element={<ServiceRequestsSystem />} />
            <Route path="payments" element={<FounderPaymentPanel />} />
            
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
          
          {/* Redirecciones para rutas no encontradas */}
          <Route path="*" element={
            <MainLayout>
              <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">Página no encontrada</h1>
                <p className="text-lg text-gray-600 mb-8">Lo sentimos, la página que buscas no existe.</p>
                <div className="space-x-4">
                  <Link to="/" className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                    Volver al inicio
                  </Link>
                  <Link to="/admin/login" className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors">
                    Admin Login
                  </Link>
                </div>
              </div>
            </MainLayout>
          } />
        </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;