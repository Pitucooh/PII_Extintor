import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Menu.css';
import Header from './components/Header';  
import Footer from './components/Footer';
import Navbar from './components/Navbar.js';

const Menu = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const navigate = useNavigate();

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="layout">
      <Header />
      <Navbar />
      
      {/* Seção COMO CHEGAR */}
      <section className="como-chegar">
        <div className="container p-1 mt-2">
          <h2 className="mb text-center" style={{ fontFamily: "'Bellota Text'", zIndex: 3 }}>
            <i className="fas fa-map-marked-alt mt-5"></i> MAPA DE SÃO PAULO
          </h2>
          <div className="info" style={{ borderRadius: '10px',  zIndex: 2 }}>
            
          </div>
          <div className="map-container" style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '20px' }}>Mapa do Metrô de São Paulo</h3>
              <div className="map-responsive">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14625.238663597389!2d-46.62222311368996!3d-23.59322470604941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5bf8fec09847%3A0x21fe6ebe5482bc4e!2sUsina%20Eco-Cultural!5e0!3m2!1spt-BR!2sbr!4v1699800994498!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%" 
                  style={{
                    border: '0',
                    borderRadius: '8px',
                    boxShadow: 'none', 
                  }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

          <div className="botao-container" style={{ marginTop: '20px', zIndex: 3, marginBottom: '3%' }}>
              <button onClick={() => openModal('O administrador pode executar todas as funções do sistema, bem como: editar, incluir e excluir')}>
                Administrador
              </button>
              <button onClick={() => openModal('O operador apenas não pode excluir informações, mas pode editar e incluir')}>
                Operador
              </button>
              <button onClick={() => openModal('O visitante tem permissão apenas para visualizar o sistema e buscar informações')}>
                Visitante
              </button>
            </div>

        </div>
        <div style={{ width: '100%', height: '25px', background: '#D9D9D9', flexShrink: 0, position: 'relative' }}></div>
        <div style={{ width: '100%', height: '30px', background: '#FFFFFF', flexShrink: 0, position: 'relative' }}></div>
      </section>

      <Footer />
    </div>
  );
};

export default Menu;
