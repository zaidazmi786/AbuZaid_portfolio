import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import About from '../components/About.jsx';
import Skills from '../components/Skills.jsx';
import Projects from '../components/Projects.jsx';
import Contact from '../components/Contact.jsx';
import Certificates from '../components/Certificates.jsx'; 

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
       <Certificates /> 
      <Contact />
    </>
  );
}
