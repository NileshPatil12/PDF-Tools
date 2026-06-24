import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/home/Hero';
import ToolsGrid from '../components/home/ToolsGrid'
import HowItWorks from '../components/home/HowItWorks'
import ContactForm from '../components/home/ContactForm'

export default function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // If there is no hash (clicking "Home" or the Logo), scroll to the top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash]);

  return (
    <>
      <Hero />
      <section id="tools">
        <ToolsGrid />
      </section>
      <section id="about">
        <HowItWorks />
      </section>
      <section id="contact">
        <ContactForm />
      </section>
    </>
  )
}
