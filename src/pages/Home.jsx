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
        <title>AeroBoost - Apoyo Académico para Carreras Aeronáuticas</title>
        <meta 
          name="description" 
          content="En AeroBoost Learning Center nos enfocamos en ayudarte a superar los desafíos de tu formación aeronáutica, ofreciendo servicios personalizados que complementan tu educación principal."
        />
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