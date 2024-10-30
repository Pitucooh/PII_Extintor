import React, { useState } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import Section from './components/Section';
import Footer from './components/Footer';
import './Portal_web.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <Header toggleTheme={toggleTheme} />
      <div className="header">
            <div className="logo"></div>
            <div className="title">
              <h1>Metrô SP - Gestão de equipamentos</h1>
              <h1>de combate a incêndio</h1>
            </div>
            <div className="company">
              <img src={logo} />
            </div>
        </div>
      <Banner />
      <Section id="about" title="Sobre Nós" content="Somos uma empresa dedicada a oferecer as melhores soluções web." />
      <Section id="services" title="Serviços" content="Oferecemos desenvolvimento de sites, consultoria e suporte técnico." />
      <Section id="contact" title="Contato" content="Entre em contato conosco pelo e-mail: contato@portalweb.com" />
      <Footer />

      <footer style={{
            backgroundColor: '#878787',
            color: '#fff',
            textAlign: 'center',
            padding: '10px 20px',
            fontSize: '14px',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.3)',
            zIndex: 1000
          }}>
            <p>&copy; 2024 - Todos os direitos reservados.</p>
            <p>
              Contact us: <a href="#" style={{ color: '#fff', textDecoration: 'underline' }}>metrocptm.com</a>
            </p>
     </footer>
    </div>

  );
}

export default App;
