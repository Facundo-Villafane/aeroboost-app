import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FaCode, FaHeart, FaRocket, FaGraduationCap, FaUsers, FaStar, FaLightbulb, FaBookOpen, FaChalkboardTeacher } from 'react-icons/fa';

const About = () => {
  return (
    <section className="py-16 bg-complement relative overflow-hidden">
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
              <h2 className="text-4xl font-semibold text-primary brand-font">Sobre CODISEA</h2>
              <FaCode className="text-3xl text-secondary" />
            </div>
            <p className="text-xl text-outline">
              Transformamos mentes curiosas en creadores del futuro digital
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
              <div className="bg-complement p-6 rounded-xl shadow-lg border-l-4 border-secondary">
                <div className="flex items-center gap-3 mb-4">
                  <FaUsers className="text-2xl text-secondary" />
                  <h3 className="text-xl font-bold text-primary">Nuestro Equipo</h3>
                </div>
                <p className="text-lightText leading-relaxed">
                  Somos <strong>expertos en educación tecnológica</strong> con años transformando vidas a través del código. 
                  Nuestro equipo combina <strong>experiencia pedagógica comprobada</strong> con dominio técnico absoluto, 
                  creando un ambiente donde cada estudiante descubre su <strong>genio interior</strong> y desarrolla 
                  superpoderes digitales que lo acompañarán toda la vida.
                </p>
              </div>

              <div className="bg-complement p-6 rounded-xl shadow-lg border-l-4 border-primary">
                <div className="flex items-center gap-3 mb-4">
                  <FaHeart className="text-2xl text-accent" />
                  <h3 className="text-xl font-bold text-primary">Nuestra Misión</h3>
                </div>
                <p className="text-lightText leading-relaxed">
                  <strong>Encender la chispa</strong> que convierte a niños y jóvenes en los <strong>innovadores tecnológicos del mañana</strong>. 
                  No solo enseñamos código, creamos <strong>arquitectos del futuro digital</strong> que piensan diferente, 
                  resuelven problemas complejos y <strong>construyen el mundo</strong> que todos queremos vivir.
                </p>
              </div>

              <div className="bg-complement p-6 rounded-xl shadow-lg border-l-4 border-secondary">
                <div className="flex items-center gap-3 mb-4">
                  <FaRocket className="text-2xl text-secondary" />
                  <h3 className="text-xl font-bold text-primary">Nuestra Visión</h3>
                </div>
                <p className="text-lightText leading-relaxed">
                  Ser <strong>LA academia #1</strong> donde los jóvenes no solo aprenden a programar, sino que 
                  <strong>despiertan su potencial ilimitado</strong>. Visualizamos un futuro donde nuestros estudiantes 
                  sean los <strong>líderes tecnológicos</strong> que revolucionen industrias, creen startups exitosas 
                  y <strong>cambien el mundo</strong> una línea de código a la vez.
                </p>
              </div>
            </motion.div>

            {/* Fortalezas y experiencia */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-gradient-to-br from-primary to-outline p-8 rounded-2xl text-complement">
                <div className="text-center mb-6">
                  <FaGraduationCap className="text-4xl text-secondary mx-auto mb-3" />
                  <h3 className="text-2xl font-semibold mb-2 brand-font">Nuestra Experiencia</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-complement/10 p-4 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <FaChalkboardTeacher className="text-secondary" />
                      <h4 className="font-semibold text-complement">Experiencia Docente</h4>
                    </div>
                    <p className="text-sm text-complement/90">Metodología probada que convierte principiantes en programadores seguros</p>
                  </div>
                  
                  <div className="bg-complement/10 p-4 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <FaBookOpen className="text-secondary" />
                      <h4 className="font-semibold text-complement">Formación Técnica</h4>
                    </div>
                    <p className="text-sm text-complement/90">Dominio técnico absoluto en cada herramienta que enseñamos</p>
                  </div>
                  
                  <div className="bg-complement/10 p-4 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <FaLightbulb className="text-secondary" />
                      <h4 className="font-semibold text-complement">Metodología Innovadora</h4>
                    </div>
                    <p className="text-sm text-complement/90">Aprendizaje divertido que transforma curiosidad en pasión</p>
                  </div>
                </div>
              </div>

              {/* Valores destacados */}
              <div className="bg-complement p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-primary mb-4 text-center brand-font">Nuestros Valores</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FaStar className="text-secondary flex-shrink-0" />
                    <span className="text-lightText"><strong>Resultados Garantizados:</strong> Cada estudiante sale programando desde el día 1</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaStar className="text-secondary flex-shrink-0" />
                    <span className="text-lightText"><strong>Experiencia Épica:</strong> Aprendizaje tan divertido que no querrán parar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaStar className="text-secondary flex-shrink-0" />
                    <span className="text-lightText"><strong>Calidad Premium:</strong> Tecnologías de vanguardia y metodologías de élite</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaStar className="text-secondary flex-shrink-0" />
                    <span className="text-lightText"><strong>Transformación Total:</strong> De principiante a creador de tecnología en tiempo récord</span>
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
            <div className="bg-gradient-to-r from-secondary to-secondary p-8 rounded-2xl">
              <h3 className="text-2xl font-semibold mb-4 text-outline brand-font">🚀 ¿Listo para desbloquear el potencial de tu hijo?</h3>
              <p className="text-lg mb-6 text-outline/90">
                Únete a la revolución educativa que está creando a los próximos genios tecnológicos
              </p>
              <Link 
                to="/servicios"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-complement font-semibold rounded-full hover:bg-accent transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={() => window.scrollTo(0, 0)}
              >
                <FaRocket />
                Inscríbete Ahora
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;