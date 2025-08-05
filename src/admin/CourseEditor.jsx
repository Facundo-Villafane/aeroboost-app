import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  collection 
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  FaSave, 
  FaTimes, 
  FaArrowLeft,
  FaCubes,
  FaPython,
  FaGlobe,
  FaRobot,
  FaGamepad,
  FaMobile,
  FaCode,
  FaUpload,
  FaImage
} from 'react-icons/fa';

const CourseEditor = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const isEditing = Boolean(courseId);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'programming',
    level: 'Principiante',
    ageRange: '8-12 años',
    duration: '2 meses',
    price: 0,
    originalPrice: 0,
    featured: false,
    status: 'active',
    image: '',
    imageUrl: '',
    features: [''],
    requirements: [''],
    whatYouWillLearn: [''],
    instructor: '',
    tools: [''],
    technologies: [''],
    projects: [''],
    certificateAvailable: true,
    maxStudents: 8,
    difficultyLevel: 1,
    estimatedHours: 0,
    videoPreviewUrl: '',
    syllabus: [
      {
        module: '',
        description: '',
        lessons: [''],
        duration: ''
      }
    ]
  });

  useEffect(() => {
    if (isEditing) {
      fetchCourse();
    }
  }, [courseId, isEditing]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (courseDoc.exists()) {
        setCourseData({ ...courseData, ...courseDoc.data() });
      } else {
        setError('Curso no encontrado');
      }
    } catch (error) {
      console.error('Error al cargar curso:', error);
      setError('Error al cargar el curso');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!courseData.title || !courseData.description || !courseData.price) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const coursePayload = {
        ...courseData,
        price: Number(courseData.price),
        originalPrice: Number(courseData.originalPrice) || Number(courseData.price),
        updatedAt: new Date()
      };

      if (isEditing) {
        await updateDoc(doc(db, 'courses', courseId), coursePayload);
      } else {
        coursePayload.createdAt = new Date();
        await addDoc(collection(db, 'courses'), coursePayload);
      }

      navigate('/admin/courses');
    } catch (error) {
      console.error('Error al guardar curso:', error);
      setError('Error al guardar el curso');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setCourseData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSyllabusChange = (moduleIndex, field, value) => {
    setCourseData(prev => ({
      ...prev,
      syllabus: prev.syllabus.map((module, i) => 
        i === moduleIndex ? { ...module, [field]: value } : module
      )
    }));
  };

  const handleLessonChange = (moduleIndex, lessonIndex, value) => {
    setCourseData(prev => ({
      ...prev,
      syllabus: prev.syllabus.map((module, i) => 
        i === moduleIndex 
          ? { 
              ...module, 
              lessons: module.lessons.map((lesson, j) => j === lessonIndex ? value : lesson)
            }
          : module
      )
    }));
  };

  const addModule = () => {
    setCourseData(prev => ({
      ...prev,
      syllabus: [...prev.syllabus, { module: '', lessons: [''] }]
    }));
  };

  const removeModule = (index) => {
    setCourseData(prev => ({
      ...prev,
      syllabus: prev.syllabus.filter((_, i) => i !== index)
    }));
  };

  const addLesson = (moduleIndex) => {
    setCourseData(prev => ({
      ...prev,
      syllabus: prev.syllabus.map((module, i) => 
        i === moduleIndex 
          ? { ...module, lessons: [...module.lessons, ''] }
          : module
      )
    }));
  };

  const removeLesson = (moduleIndex, lessonIndex) => {
    setCourseData(prev => ({
      ...prev,
      syllabus: prev.syllabus.map((module, i) => 
        i === moduleIndex 
          ? { ...module, lessons: module.lessons.filter((_, j) => j !== lessonIndex) }
          : module
      )
    }));
  };

  const getCourseIcon = (category) => {
    const icons = {
      'roblox': FaCubes,
      'python': FaPython,
      'web': FaGlobe,
      'ai': FaRobot,
      'gamedev': FaGamepad,
      'mobile': FaMobile,
      'programming': FaCode
    };
    
    const IconComponent = icons[category] || FaCode;
    return <IconComponent className="text-2xl" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/courses')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-xl text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Editar Curso' : 'Nuevo Curso'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? 'Modifica la información del curso' : 'Crea un nuevo curso para la plataforma'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/courses')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <FaTimes />
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <FaSave />
            {saving ? 'Guardando...' : 'Guardar Curso'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Básica</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Curso *
                </label>
                <input
                  type="text"
                  value={courseData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Python para Principiantes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Corta
                </label>
                <input
                  type="text"
                  value={courseData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Breve descripción que aparece en las tarjetas"
                  maxLength={150}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Completa *
                </label>
                <textarea
                  value={courseData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descripción detallada del curso, objetivos, metodología..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    value={courseData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="programming">Programación</option>
                    <option value="python">Python</option>
                    <option value="web">Desarrollo Web</option>
                    <option value="roblox">Roblox</option>
                    <option value="gamedev">Desarrollo de Juegos</option>
                    <option value="mobile">Desarrollo Móvil</option>
                    <option value="ai">Inteligencia Artificial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nivel
                  </label>
                  <select
                    value={courseData.level}
                    onChange={(e) => handleInputChange('level', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rango de Edad
                  </label>
                  <input
                    type="text"
                    value={courseData.ageRange}
                    onChange={(e) => handleInputChange('ageRange', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: 8-12 años"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración
                  </label>
                  <input
                    type="text"
                    value={courseData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: 2 meses"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructor
                </label>
                <input
                  type="text"
                  value={courseData.instructor}
                  onChange={(e) => handleInputChange('instructor', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre del instructor"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Características del Curso</h2>
            
            <div className="space-y-4">
              {courseData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleArrayChange('features', index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Característica del curso"
                  />
                  <button
                    onClick={() => removeArrayItem('features', index)}
                    className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('features')}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                + Agregar Característica
              </button>
            </div>
          </div>

          {/* What You Will Learn */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Qué Aprenderás</h2>
            
            <div className="space-y-4">
              {courseData.whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('whatYouWillLearn', index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Objetivo de aprendizaje"
                  />
                  <button
                    onClick={() => removeArrayItem('whatYouWillLearn', index)}
                    className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('whatYouWillLearn')}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                + Agregar Objetivo
              </button>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Requisitos</h2>
            
            <div className="space-y-4">
              {courseData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Requisito para el curso"
                  />
                  <button
                    onClick={() => removeArrayItem('requirements', index)}
                    className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('requirements')}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                + Agregar Requisito
              </button>
            </div>
          </div>

          {/* Tools and Technologies */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Herramientas y Tecnologías</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Herramientas</h3>
                <div className="space-y-4">
                  {courseData.tools.map((tool, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tool}
                        onChange={(e) => handleArrayChange('tools', index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Herramienta (ej: Visual Studio Code)"
                      />
                      <button
                        onClick={() => removeArrayItem('tools', index)}
                        className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('tools')}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    + Agregar Herramienta
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Tecnologías</h3>
                <div className="space-y-4">
                  {courseData.technologies.map((tech, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) => handleArrayChange('technologies', index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tecnología (ej: Python, HTML, CSS)"
                      />
                      <button
                        onClick={() => removeArrayItem('technologies', index)}
                        className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('technologies')}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    + Agregar Tecnología
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Proyectos del Curso</h2>
            
            <div className="space-y-4">
              {courseData.projects.map((project, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={project}
                    onChange={(e) => handleArrayChange('projects', index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Proyecto que crearán los estudiantes"
                  />
                  <button
                    onClick={() => removeArrayItem('projects', index)}
                    className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('projects')}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                + Agregar Proyecto
              </button>
            </div>
          </div>

          {/* Additional Course Info */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Adicional</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo Estudiantes
                </label>
                <input
                  type="number"
                  value={courseData.maxStudents}
                  onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horas Estimadas
                </label>
                <input
                  type="number"
                  value={courseData.estimatedHours}
                  onChange={(e) => handleInputChange('estimatedHours', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel de Dificultad (1-5)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={courseData.difficultyLevel}
                  onChange={(e) => handleInputChange('difficultyLevel', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Muy Fácil</span>
                  <span className="font-medium">Nivel {courseData.difficultyLevel}</span>
                  <span>Muy Difícil</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Video Preview (opcional)
                </label>
                <input
                  type="url"
                  value={courseData.videoPreviewUrl}
                  onChange={(e) => handleInputChange('videoPreviewUrl', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={courseData.certificateAvailable}
                    onChange={(e) => handleInputChange('certificateAvailable', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Certificado disponible al completar el curso
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Preview */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Vista Previa</h2>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  {getCourseIcon(courseData.category)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {courseData.title || 'Título del curso'}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {courseData.ageRange} • {courseData.duration}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-3">
                {courseData.shortDescription || 'Descripción corta...'}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-green-600">
                  ${courseData.price.toLocaleString('es-AR')}
                </div>
                {courseData.originalPrice > courseData.price && (
                  <div className="text-sm text-gray-500 line-through">
                    ${courseData.originalPrice.toLocaleString('es-AR')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Precios</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Actual *
                </label>
                <input
                  type="number"
                  value={courseData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Original (opcional)
                </label>
                <input
                  type="number"
                  value={courseData.originalPrice}
                  onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mostrará descuento si es mayor al precio actual
                </p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={courseData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={courseData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Curso destacado
                </label>
              </div>
            </div>
          </div>

          {/* Syllabus Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Temario del Curso</h2>
            
            <div className="space-y-6">
              {courseData.syllabus.map((module, moduleIndex) => (
                <div key={moduleIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="text"
                      value={module.module}
                      onChange={(e) => handleSyllabusChange(moduleIndex, 'module', e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold"
                      placeholder={`Módulo ${moduleIndex + 1}`}
                    />
                    <button
                      onClick={() => removeModule(moduleIndex)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={courseData.syllabus.length === 1}
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="pl-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Lecciones:</h4>
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={lesson}
                          onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder={`Lección ${lessonIndex + 1}`}
                        />
                        <button
                          onClick={() => removeLesson(moduleIndex, lessonIndex)}
                          className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                          disabled={module.lessons.length === 1}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addLesson(moduleIndex)}
                      className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm"
                    >
                      + Agregar Lección
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                onClick={addModule}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors font-medium"
              >
                + Agregar Módulo
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Imagen</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de la Imagen
                </label>
                <input
                  type="url"
                  value={courseData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              
              {courseData.image && (
                <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={courseData.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center text-gray-500" style={{display: 'none'}}>
                    <FaImage className="text-2xl" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;