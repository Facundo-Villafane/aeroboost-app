
import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

const QuillEditor = ({ value, onChange, placeholder, height = '400px' }) => {
  const editorContainerRef = useRef(null);
  const quillInstance = useRef(null);
  const [isReady, setIsReady] = useState(false);
  
  // Solo inicializar una vez al montar el componente
  useEffect(() => {
    if (!editorContainerRef.current) return;
    
    // Limpieza preventiva
    document.querySelectorAll('.ql-toolbar').forEach(toolbar => toolbar.remove());
    
    // Configurar el editor
    const toolbarOptions = [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'blockquote', 'code-block'],
      ['clean']
    ];

    // Inicializar Quill
    quillInstance.current = new Quill(editorContainerRef.current, {
      modules: {
        toolbar: {
          container: toolbarOptions,
          handlers: {
            'image': function() {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              input.click();

              input.onchange = async () => {
                if (input.files && input.files[0]) {
                  const file = input.files[0];
                  const quill = quillInstance.current;
                  const range = quill.getSelection(true);

                  // Placeholder mientras se carga
                  quill.insertText(range.index, 'Subiendo imagen...');
                  quill.setSelection(range.index + 16);
                  
                  try {
                    const storageRef = ref(storage, `blog/content/${Date.now()}_${file.name}`);
                    await uploadBytes(storageRef, file);
                    const downloadURL = await getDownloadURL(storageRef);
                    
                    // Reemplazar placeholder con la imagen
                    quill.deleteText(range.index, 16);
                    quill.insertEmbed(range.index, 'image', downloadURL);
                  } catch (error) {
                    console.error('Error al subir la imagen:', error);
                    quill.deleteText(range.index, 16);
                    quill.insertText(range.index, 'Error al subir la imagen');
                  }
                }
              };
            }
          }
        }
      },
      placeholder: placeholder || 'Escribe aquí...',
      theme: 'snow'
    });
    
    // Establecer contenido inicial si existe
    if (value) {
      quillInstance.current.root.innerHTML = value;
    }
    
    // Evento para cambios en el editor
    quillInstance.current.on('text-change', () => {
      if (onChange) {
        onChange(quillInstance.current.root.innerHTML);
      }
    });
    
    setIsReady(true);
    
    // Limpieza al desmontar
    return () => {
      quillInstance.current = null;
      setIsReady(false);
    };
  }, []);
  
  // Actualizar el contenido si cambia desde fuera
  useEffect(() => {
    if (isReady && quillInstance.current && value !== undefined && value !== quillInstance.current.root.innerHTML) {
      quillInstance.current.root.innerHTML = value;
    }
  }, [value, isReady]);

  return (
    <div>
      <div
        ref={editorContainerRef}
        style={{ height }}
      ></div>
    </div>
  );
};

export default QuillEditor;