import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaUser, FaSpinner, FaCode, FaHeart, FaRocket } from 'react-icons/fa';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Aquí iría la lógica de envío del formulario
    console.log('Enviando formulario:', formData);
    
    // Simular delay de envío
    setTimeout(() => {
      setIsSubmitting(false);
      alert('¡Mensaje enviado correctamente! Te contactaremos pronto.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 2000);
  };

  return (
    <section className="py-16 bg-outline" id="contacto">
      <div className="container mx-auto px-4">
        {/* Cabecera */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-complement mb-4 brand-font">
            ¡Empecemos tu aventura en programación!
          </h2>
          <p className="text-xl text-complement mb-4 font-medium">
            Cuéntanos sobre ti y encontraremos el curso perfecto
          </p>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Nuestro equipo de expertos te ayudará a elegir el programa ideal según 
            tu edad, experiencia y objetivos. ¡El primer paso hacia tu futuro tecnológico comienza aquí!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Información de contacto */}
          <motion.div
            className="bg-primary p-8 rounded-2xl text-complement"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaCode className="text-2xl text-secondary" />
              <h3 className="text-2xl font-bold brand-font">¿Por qué elegir CODISEA?</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-secondary/20 p-3 rounded-lg">
                  <FaUser className="text-secondary text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Atención Personalizada</h4>
                  <p className="text-complement/90 text-sm leading-relaxed">
                    Grupos pequeños con máximo 8 estudiantes para garantizar que cada persona 
                    reciba la atención y el seguimiento que merece.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-secondary/20 p-3 rounded-lg">
                  <FaHeart className="text-secondary text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Metodología Divertida</h4>
                  <p className="text-complement/90 text-sm leading-relaxed">
                    Aprender programación nunca fue tan entretenido. Combinamos teoría y práctica 
                    con proyectos emocionantes y desafíos creativos.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-secondary/20 p-3 rounded-lg">
                  <FaRocket className="text-secondary text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Resultados Garantizados</h4>
                  <p className="text-complement/90 text-sm leading-relaxed">
                    95% de nuestros estudiantes completan sus cursos exitosamente y continúan 
                    desarrollando proyectos por cuenta propia.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-complement/10 rounded-lg">
              <p className="text-complement text-sm text-center">
                <strong>Respuesta garantizada en menos de 24 horas</strong><br />
                Nuestro equipo está listo para ayudarte a dar el primer paso
              </p>
            </div>
          </motion.div>

          {/* Formulario */}
          <motion.div
            className="bg-complement p-8 rounded-2xl shadow-xl"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              
              <div>
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
              
              <div>
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
              
              <p className="text-sm text-gray-600 text-center mt-4">
                Te responderemos en menos de 24 horas
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;