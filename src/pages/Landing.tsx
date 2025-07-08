import { useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import Navbar from '../components/Navbar';
import { navItems } from '../components/landing/data';
import { HeartIcon } from '../components/landing/icons';
import { HeroSection, FeaturesSection, HowItWorksSection, DemoSection, EventsSection, FAQSection } from '../components/landing/sections';

import '../styles/Landing.css';



const Landing = () => {
  const { theme } = useUser();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };



  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [theme]);

  return (
    <>
      <Navbar 
        navItems={navItems}
        onNavigate={scrollToSection}
        showNavigation={true}
      />
    <div className={`landing-container ${theme}`}>
     

      <HeroSection theme={theme} />

      <FeaturesSection theme={theme} />

      <HowItWorksSection theme={theme} />

      <DemoSection theme={theme} />

      <EventsSection theme={theme} />

      <FAQSection theme={theme} />

      <footer className={`landing-footer ${theme}`}>
        <div className="landing-footer-content">
          <div className="landing-footer-logo">
            <HeartIcon className="footer-logo-icon" />
            <span className="footer-logo-text">Mente Sana</span>
          </div>
          
          <p className="landing-footer-text">
            Diseñada especialmente para adolescentes que buscan entender y cuidar 
            su salud mental con el apoyo de tecnología inteligente y contenido especializado.
          </p>
          
          <div className="footer-copyright">
            <p>© 2024 Mente Sana. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};


export default Landing;