import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaSpinner, FaCode, FaClock } from 'react-icons/fa';

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
    <section className="py-16 bg-outline" id="contacto">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaCode className="text-3xl text-secondary" />
            <h2 className="text-4xl font-semibold text-complement brand-font">Contáctanos</h2>
            <FaCode className="text-3xl text-secondary" />
          </div>
          <p className="text-xl text-secondary-2">¿Listo para descubrir el mundo de la programación?</p>
          <p className="text-complement/80 mt-2">Estamos aquí para responder todas tus dudas</p>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row bg-complement rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
          <motion.div 
            className="lg:w-1/3 bg-gradient-to-br from-primary to-primary text-complement p-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-semibold mb-6 brand-font">Información de Contacto</h3>
            
            <div className="mb-8 flex items-start">
              <FaEnvelope className="text-xl text-secondary mr-4 mt-1" />
              <div>
                <p className="font-semibold text-complement">Email:</p>
                <p className="text-secondary-2">info@codisea.dev</p>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex items-start mb-4">
                <FaClock className="text-xl text-secondary mr-4 mt-1" />
                <div>
                  <p className="font-semibold text-complement mb-2">Horario de atención:</p>
                  <div className="space-y-1 text-secondary-2">
                    <p>Lunes a Viernes: 9:00 - 18:00</p>
                    <p>Sábados: 9:00 - 13:00</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-complement/10 p-4 rounded-xl backdrop-blur-sm">
              <h4 className="font-semibold text-complement mb-2">¿Por qué elegirnos?</h4>
              <ul className="space-y-2 text-sm text-secondary-2">
                <li>✓ Clases 100% online</li>
                <li>✓ Instructores especializados</li>
                <li>✓ Metodología divertida</li>
                <li>✓ Proyectos reales</li>
              </ul>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-2/3 p-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-semibold text-primary mb-6">Envíanos un mensaje</h3>
            
            {submitMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-6">
                {submitMessage}
              </div>
            )}
            
            {submitError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
                {submitError}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium text-primary mb-2">
                  Teléfono (opcional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300"
                  placeholder="+54 11 1234-5678"
                />
              </div>
              
              <div className="mb-8">
                <label htmlFor="message" className="block text-sm font-medium text-primary mb-2">
                  Cuéntanos más sobre ti
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300 resize-none"
                  placeholder="Tu edad, experiencia previa en programación, curso de interés, etc."
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-primary text-complement font-semibold rounded-xl hover:bg-accent transition-all duration-300 disabled:opacity-70 flex items-center justify-center transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2 text-secondary" />
                    Enviando mensaje...
                  </>
                ) : (
                  <>
                    <FaEnvelope className="mr-2" />
                    Enviar mensaje
                  </>
                )}
              </button>
              
              <p className="text-sm text-lightText text-center mt-4">
                Te responderemos en menos de 24 horas 🚀
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;