import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FaCode, FaHeart, FaRocket, FaGraduationCap, FaUsers, FaStar } from 'react-icons/fa';

const About = () => {
  return (
    <section className="py-16 bg-card-bg relative overflow-hidden">
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 opacity-5">
        <div className="coding-pattern h-full w-full"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaCode className="text-3xl text-secondary" />
              <h2 className="text-4xl font-bold text-primary">Sobre CODISEA</h2>
              <FaCode className="text-3xl text-secondary" />
            </div>
            <p className="text-xl text-lightText">
              Donde la pasión por enseñar se encuentra con la innovación tecnológica
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contenido principal */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-secondary">
                <div className="flex items-center gap-3 mb-4">
                  <FaUsers className="text-2xl text-secondary" />
                  <h3 className="text-xl font-bold text-primary">Nuestro Equipo</h3>
                </div>
                <p className="text-lightText leading-relaxed">
                  Somos un grupo de profesionales apasionados con experiencia en docencia y 
                  especialización en tecnología educativa. Cada miembro de nuestro equipo aporta 
                  años de experiencia enseñando a jóvenes y una profunda comprensión de cómo 
                  hacer que la programación sea accesible y emocionante.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-primary">
                <div className="flex items-center gap-3 mb-4">
                  <FaHeart className="text-2xl text-red-500" />
                  <h3 className="text-xl font-bold text-primary">Nuestra Misión</h3>
                </div>
                <p className="text-lightText leading-relaxed">
                  Inspirar y empoderar a la próxima generación de innovadores tecnológicos. 
                  Creemos que cada niño y joven tiene el potencial de crear soluciones increíbles, 
                  y nuestra misión es proporcionarles las herramientas y la confianza para hacerlo realidad.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-secondary">
                <div className="flex items-center gap-3 mb-4">
                  <FaRocket className="text-2xl text-secondary" />
                  <h3 className="text-xl font-bold text-primary">Nuestra Visión</h3>
                </div>
                <p className="text-lightText leading-relaxed">
                  Ser la academia líder en educación tecnológica para jóvenes, reconocida por 
                  formar estudiantes que no solo dominan la programación, sino que desarrollan 
                  pensamiento crítico, creatividad y habilidades para resolver problemas del mundo real.
                </p>
              </div>
            </motion.div>

            {/* Estadísticas y logros */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-gradient-to-br from-primary to-primary p-8 rounded-2xl text-white">
                <div className="text-center mb-6">
                  <FaGraduationCap className="text-4xl text-secondary mx-auto mb-3" />
                  <h3 className="text-2xl font-bold mb-2">¿Por qué confiar en nosotros?</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <div className="text-3xl font-bold text-secondary mb-1">500+</div>
                    <div className="text-sm opacity-90">Estudiantes Formados</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <div className="text-3xl font-bold text-secondary mb-1">95%</div>
                    <div className="text-sm opacity-90">Satisfacción Familiar</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <div className="text-3xl font-bold text-secondary mb-1">3+</div>
                    <div className="text-sm opacity-90">Años Experiencia</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <div className="text-3xl font-bold text-secondary mb-1">50+</div>
                    <div className="text-sm opacity-90">Proyectos Creados</div>
                  </div>
                </div>
              </div>

              {/* Valores destacados */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-primary mb-4 text-center">Nuestros Valores</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FaStar className="text-secondary flex-shrink-0" />
                    <span className="text-lightText"><strong>Innovación:</strong> Siempre buscamos nuevas formas de enseñar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaStar className="text-secondary flex-shrink-0" />
                    <span className="text-lightText"><strong>Inclusión:</strong> Programación para todos, sin excepciones</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaStar className="text-secondary flex-shrink-0" />
                    <span className="text-lightText"><strong>Diversión:</strong> Aprender debe ser una experiencia emocionante</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaStar className="text-secondary flex-shrink-0" />
                    <span className="text-lightText"><strong>Excelencia:</strong> Comprometidos con la calidad educativa</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to action */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-gradient-to-r from-secondary to-secondary p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-4">¿Listo para conocer más sobre nosotros?</h3>
              <p className="text-lg mb-6 opacity-90">
                Descubre cómo transformamos vidas a través de la educación tecnológica
              </p>
              <Link 
                to="/sobre-nosotros"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-secondary font-bold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={() => window.scrollTo(0, 0)}
              >
                <FaRocket />
                Conoce nuestra historia completa
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;