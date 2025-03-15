import React from 'react';
import ContactForm from '../components/ContactForm';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet'; 

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Contacto - AeroBoost</title>
        <meta name="description" content="Comunícate con el equipo de AeroBoost. Estamos aquí para responder tus consultas sobre formación aeronáutica." />
      </Helmet>
      
      {/* Banner de cabecera */}
      <motion.div 
        className="bg-primary text-white py-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h1>
          <p className="text-xl max-w-2xl">
            Estamos a tu disposición para responder cualquier consulta sobre nuestros servicios.
          </p>
        </div>
      </motion.div>
      
      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-12">
        {/* Mapa de ubicación (opcional) 
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Nuestra Ubicación</h2>
          <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
             Reemplazar el src con tu API key de Google Maps o usar una alternativa como OpenStreetMap */}
            {/*<iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168878895438!2d-58.38375908514173!3d-34.60373446500578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4aa9f0a6da5edb%3A0x11bead4e234e558b!2sObelisco!5e0!3m2!1ses!2sar!4v1647654099273!5m2!1ses!2sar"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación AeroBoost"
            ></iframe>
          </div>
        </motion.div>*/}
        
        {/* Formulario de contacto */}
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactPage;
