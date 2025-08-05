import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '../admin/AuthProvider';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getGravatarUrl } from '../utils/gravatar';
import { 
  FaUser, 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaCamera,
  FaGraduationCap,
  FaCertificate,
  FaStar,
  FaTrophy
} from 'react-icons/fa';

const StudentProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    aboutMe: '',
    interests: [],
    goals: ''
  });
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        const profile = {
          displayName: data.displayName || user.displayName || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          dateOfBirth: data.dateOfBirth || '',
          aboutMe: data.aboutMe || '',
          interests: data.interests || [],
          goals: data.goals || ''
        };
        setProfileData(profile);
        setOriginalData(profile);
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...profileData,
        updatedAt: new Date()
      });
      setOriginalData(profileData);
      setEditing(false);
      // Mostrar notificación de éxito
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      // Mostrar notificación de error
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setEditing(false);
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const achievements = [
    { id: 1, title: 'Primer Curso Completado', icon: FaGraduationCap, earned: true, date: '2024-02-15' },
    { id: 2, title: 'Estudiante Dedicado', icon: FaStar, earned: true, date: '2024-03-01' },
    { id: 3, title: 'Programador Junior', icon: FaCertificate, earned: false, date: null },
    { id: 4, title: 'Experto en Python', icon: FaTrophy, earned: false, date: null }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Mi Perfil | Estudiante CODISEA</title>
        <meta name="description" content="Gestiona tu perfil de estudiante" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-primary">Mi Perfil</h1>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-accent transition-colors"
              >
                <FaEdit />
                Editar Perfil
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <FaSave />
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  <FaTimes />
                  Cancelar
                </button>
              </div>
            )}
          </div>

          {/* Profile Picture and Basic Info */}
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-xl">
                <img 
                  src={getGravatarUrl(profileData.email, 256)} 
                  alt={profileData.displayName || 'Estudiante'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback si Gravatar falla
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-4xl font-bold" style={{display: 'none'}}>
                  {profileData.displayName ? profileData.displayName.charAt(0).toUpperCase() : 'E'}
                </div>
              </div>
              
              {/* Botón para cambiar imagen (enlace a Gravatar) */}
              <a
                href="https://gravatar.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-0 right-0 w-10 h-10 bg-secondary text-primary rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors shadow-lg"
                title="Cambiar foto en Gravatar.com"
              >
                <FaCamera />
              </a>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nombre Completo</label>
                  {editing ? (
                    <input
                      type="text"
                      value={profileData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{profileData.displayName || 'No especificado'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{profileData.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Ej: +54 11 1234-5678"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{profileData.phone || 'No especificado'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Fecha de Nacimiento</label>
                  {editing ? (
                    <input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                      {profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString('es-ES') : 'No especificado'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* About Me Section */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-primary mb-4">Sobre Mí</h2>
          {editing ? (
            <textarea
              value={profileData.aboutMe}
              onChange={(e) => handleInputChange('aboutMe', e.target.value)}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Cuéntanos sobre ti, tus intereses en programación, qué te motiva a aprender..."
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">
              {profileData.aboutMe || 'Aún no has escrito nada sobre ti. ¡Edita tu perfil para agregar información!'}
            </p>
          )}
        </motion.div>

        {/* Goals Section */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-primary mb-4">Mis Objetivos</h2>
          {editing ? (
            <textarea
              value={profileData.goals}
              onChange={(e) => handleInputChange('goals', e.target.value)}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="¿Cuáles son tus objetivos de aprendizaje? ¿Qué quieres lograr con la programación?"
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">
              {profileData.goals || 'Define tus objetivos de aprendizaje para mantenerte motivado.'}
            </p>
          )}
        </motion.div>

        {/* Achievements */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-primary mb-6">Mis Logros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  achievement.earned 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <achievement.icon 
                    className={`text-2xl ${
                      achievement.earned ? 'text-green-600' : 'text-gray-400'
                    }`} 
                  />
                  <h3 className={`font-semibold ${
                    achievement.earned ? 'text-green-800' : 'text-gray-700'
                  }`}>
                    {achievement.title}
                  </h3>
                </div>
                {achievement.earned && achievement.date && (
                  <p className="text-sm text-green-600">
                    Obtenido el {new Date(achievement.date).toLocaleDateString('es-ES')}
                  </p>
                )}
                {!achievement.earned && (
                  <p className="text-sm text-gray-600">Por desbloquear</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentProfile;