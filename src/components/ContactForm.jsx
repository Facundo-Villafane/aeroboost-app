import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitError('');
    
    try {
      // Crear un objeto FormData para enviar al servidor PHP
      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key]);
      }
      
      // Enviar los datos al script PHP
      const response = await fetch(import.meta.env.VITE_CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        body: form,
      });
      
      // Obtener la respuesta del servidor
      const result = await response.json();
      
      if (response.ok) {
        // Éxito en el envío
        setSubmitMessage(result.message || '¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.');
        // Limpiar el formulario
        setFormData({ name: '', email: '', phone: '', message: '' });
        
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => setSubmitMessage(''), 5000);
      } else {
        // Error en el envío
        setSubmitError(result.error || 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setSubmitError('Hubo un problema al conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="py-16 bg-gray-50" id="contacto">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-darkText mb-2">Contáctanos</h2>
          <p className="text-lightText">Estamos aquí para responder tus dudas</p>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row bg-white rounded-lg overflow-hidden shadow-xl">
          <motion.div 
            className="lg:w-1/3 bg-primary text-white p-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-6">Información de Contacto</h3>
            {/*<div className="mb-6 flex items-start">
              <FaMapMarkerAlt className="text-xl mr-4 mt-1" />
              <div>
                <p className="font-semibold">Dirección:</p>
                <p>Av. Aeropuerto 1234, Ciudad</p>
              </div>
            </div>
            <div className="mb-6 flex items-start">
              <FaPhone className="text-xl mr-4 mt-1" />
              <div>
                <p className="font-semibold">Teléfono:</p>
                <p>+1 234 567 890</p>
              </div>
            </div>*/}
            <div className="mb-6 flex items-start">
              <FaEnvelope className="text-xl mr-4 mt-1" />
              <div>
                <p className="font-semibold">Email:</p>
                <p>info@aeroboost.com.ar</p>
              </div>
            </div>
            <div className="mt-8">
              <p className="font-semibold mb-2">Horario de atención:</p>
              <p>Lunes a Viernes: 8:00 - 18:00</p>
              <p>Sábados: 9:00 - 13:00</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-2/3 p-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {submitMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {submitMessage}
              </div>
            )}
            
            {submitError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {submitError}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  'Enviar mensaje'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;