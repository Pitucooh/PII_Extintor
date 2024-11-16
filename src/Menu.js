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
      <div className="container">

        <div className="metro-map-container">
          <h3>Mapa do Metrô de São Paulo</h3>
          <div className="map-container" style={{ textAlign: 'center'}}>
          <h3 style={{ marginBottom: '20px' }}>Mapa do Metrô de São Paulo</h3>
          <div className="map-responsive rounded">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14625.238663597389!2d-46.62222311368996!3d-23.59322470604941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5bf8fec09847%3A0x21fe6ebe5482bc4e!2sUsina%20Eco-Cultural!5e0!3m2!1spt-BR!2sbr!4v1699800994498!5m2!1spt-BR!2sbr"
              width="100%" height="400px"
              style={{
                border: '0',
                boxShadow: '15px 15px lightblue',
                borderRadius: '8px'
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        </div>
        <h3>Funcionalidades</h3>
        {/* Botões abaixo do mapa, organizados na horizontal */}
        <div className="buttons-container">
        
          <button onClick={() => openModal('O administrador pode executar todas as funções do sistema, bem como: editar, incluir e excluir')}>Administrador</button>
          <button onClick={() => openModal('O operador apenas não pode excluir informações, mas pode editar e incluir')}>Operador</button>
          <button onClick={() => openModal('O visitante tem permissão apenas para visualizar o sistema e buscar informações')}>Visitante</button>
        </div>
      </div>
      <Footer />

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <button onClick={closeModal} className="close-button">X</button>
            </div>
            <div className="modal-content">
              {modalContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
