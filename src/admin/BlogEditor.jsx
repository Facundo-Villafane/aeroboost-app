
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import { FaSave, FaImage, FaSpinner, FaTimes, FaEye, FaArrowLeft } from 'react-icons/fa';
import QuillEditor from '../components/QuillEditor'; // Importar el nuevo componente

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id && id !== 'new';
  
  const [post, setPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    status: 'Borrador',
    tags: [],
    author: auth.currentUser?.displayName || auth.currentUser?.email || 'Admin',
    authorId: auth.currentUser?.uid
  });

  const [imageUpload, setImageUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [imageName, setImageName] = useState('');
  const [tagsInputValue, setTagsInputValue] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchPost();
    } else {
      const currentAuthor = auth.currentUser?.displayName || auth.currentUser?.email || 'Admin';
      setPost({
        title: '',
        excerpt: '',
        content: '',
        coverImage: '',
        status: 'Borrador',
        tags: [],
        author: currentAuthor,
        authorId: auth.currentUser?.uid
      });
      setTagsInputValue('');
      setError('');
    }
  }, [id, isEditMode]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'posts', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const postData = docSnap.data();
        setPost(postData);
        // Actualizar el valor del input de etiquetas
        if (postData.tags && postData.tags.length > 0) {
          setTagsInputValue(postData.tags.join(', '));
        }
      } else {
        setError('La publicación no existe');
        navigate('/admin/blog');
      }
    } catch (error) {
      console.error('Error al cargar la publicación:', error);
      setError('Error al cargar la publicación');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  // Manejador para cambios en el editor Quill
  const handleEditorChange = (content) => {
    setPost(prev => ({ ...prev, content }));
  };

  const handleTagsChange = (e) => {
    // Guardar el valor del input
    const tagsString = e.target.value;
    setTagsInputValue(tagsString);
    
    // Procesar las etiquetas
    const tagsArray = tagsString.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    setPost(prev => ({ ...prev, tags: tagsArray }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageUpload(e.target.files[0]);
      setImageName(e.target.files[0].name);
    }
  };

  const removeSelectedImage = () => {
    setImageUpload(null);
    setImageName('');
  };

  const uploadImage = async () => {
    if (!imageUpload) return post.coverImage;

    setImageUploading(true);
    try {
      const storageRef = ref(storage, `blog/${Date.now()}_${imageUpload.name}`);
      await uploadBytes(storageRef, imageUpload);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw error;
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!post.title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let imageUrl = post.coverImage;

      if (imageUpload) {
        imageUrl = await uploadImage();
      }

      const postData = {
        ...post,
        coverImage: imageUrl,
        updatedAt: serverTimestamp()
      };

      if (isEditMode) {
        // Actualizar publicación existente
        await setDoc(doc(db, 'posts', id), postData, { merge: true });
      } else {
        // Crear nueva publicación
        postData.date = serverTimestamp();
        postData.views = 0;
        await addDoc(collection(db, 'posts'), postData);
      }

      navigate('/admin/blog');
    } catch (error) {
      console.error('Error al guardar la publicación:', error);
      setError('Error al guardar la publicación');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate('/admin/blog')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-semibold">
            {isEditMode ? 'Editar publicación' : 'Nueva publicación'}
          </h2>
        </div>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors flex items-center"
          >
            <FaEye className="mr-2" />
            {previewMode ? 'Editar' : 'Vista previa'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!previewMode ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={post.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Escribe un título atractivo"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
              Extracto
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={post.excerpt}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Breve resumen de la publicación (aparecerá en listados)"
            ></textarea>
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Contenido
            </label>
            <div className="border border-gray-300 rounded-md">
              {/* Usar el componente QuillEditor dedicado */}
              <QuillEditor
                value={post.content}
                onChange={handleEditorChange}
                placeholder="Escribe el contenido de tu publicación aquí..."
                height="400px"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
              Imagen de portada
            </label>
            {post.coverImage && (
              <div className="mb-2">
                <div className="relative inline-block">
                  <img
                    src={post.coverImage}
                    alt="Portada"
                    className="w-40 h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setPost(prev => ({ ...prev, coverImage: '' }))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center">
              <label className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                <FaImage className="inline mr-2" />
                {imageUploading ? 'Subiendo...' : 'Seleccionar imagen'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={imageUploading}
                />
              </label>
              {imageName && (
                <div className="ml-2 flex items-center">
                  <span className="text-sm text-gray-600 mr-2">
                    {imageName}
                  </span>
                  <button
                    type="button"
                    onClick={removeSelectedImage}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Etiquetas (separadas por comas)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={tagsInputValue}
              onChange={handleTagsChange}
              placeholder="ej: aviación, entrenamiento, pilotos"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Autor
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={post.author}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="status"
                name="status"
                value={post.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="Borrador">Borrador</option>
                <option value="Publicado">Publicado</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/blog')}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-100 transition-colors mr-4"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || imageUploading}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center"
            >
              {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
              {loading ? 'Guardando...' : 'Guardar publicación'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <span>Por {post.author}</span>
              <span className="mx-2">•</span>
              <span>{new Date().toLocaleDateString()}</span>
              {post.tags.length > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <div className="flex flex-wrap">
                    {post.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded mr-2 mb-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
            {post.excerpt && (
              <div className="text-gray-700 italic mb-6 border-l-4 border-primary pl-4 py-2 bg-gray-50">
                {post.excerpt}
              </div>
            )}
            <div 
              className="prose max-w-none" 
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogEditor;