import { Helmet } from 'react-helmet';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Services from '../components/Services';
import About from '../components/About';
import BlogPreview from '../components/BlogPreview';
import ContactForm from '../components/ContactForm';

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>CODISEA - Programación para Niños y Jóvenes | Aprende Coding Divertido</title>
        <meta 
          name="description" 
          content="Descubre el emocionante mundo de la programación en CODISEA. Cursos de coding para niños y jóvenes de 8 a 17 años. Scratch, Python, desarrollo web y más. ¡Aprende jugando!"
        />
        <meta 
          name="keywords" 
          content="programación niños, coding jóvenes, scratch niños, python jóvenes, desarrollo web, programación Argentina, cursos programming, CODISEA, aprender programar jugando"
        />
        <meta property="og:title" content="CODISEA - Programación para Niños y Jóvenes" />
        <meta property="og:description" content="Descubre el emocionante mundo de la programación en CODISEA. Cursos de coding para niños y jóvenes de 8 a 17 años." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/codisea-hero.png" />
        
        {/* Structured Data específico para la página home */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "CODISEA - Programación para Niños y Jóvenes",
          "description": "Academia especializada en enseñar programación a niños y jóvenes de forma divertida y efectiva",
          "url": "https://codisea.com",
          "mainEntity": {
            "@type": "EducationalOrganization",
            "name": "CODISEA",
            "description": "Academia de programación para niños y jóvenes",
            "offers": [
              {
                "@type": "Course",
                "name": "Scratch para Principiantes",
                "description": "Curso de programación con Scratch para niños de 8-12 años",
                "provider": "CODISEA"
              },
              {
                "@type": "Course", 
                "name": "Python para Jóvenes",
                "description": "Curso de Python para jóvenes de 12-17 años",
                "provider": "CODISEA"
              },
              {
                "@type": "Course",
                "name": "Desarrollo Web Juvenil", 
                "description": "Curso de desarrollo web para jóvenes de 13-17 años",
                "provider": "CODISEA"
              }
            ]
          }
        })}
        </script>
      </Helmet>
      
      <Hero />
      <Features />
      <Services />
      <About />
      <BlogPreview />
      <ContactForm />
    </div>
  );
};

export default Home;