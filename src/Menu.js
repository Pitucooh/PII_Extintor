import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Menu.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar.js";

const Menu = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
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
        <div className="menu-layout p-1 mt-2">
          <div className="modal-wrapper" style={{ paddingTop: "150px" }}>
            <div className="title-modal">
              <h3>MAPA DE SÃO PAULO</h3>
            </div>
          </div>
          <div className="map-container">
            <div className="map-responsive">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58509.6946811248!2d-46.63283393154372!3d-23.573617701077403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5bd2efeb44b1%3A0xa140ce2757886229!2sCh%C3%A1cara%20Klabin!5e0!3m2!1spt-BR!2sbr!4v1731812334794!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{
                  border: "0",
                  borderRadius: "8px",
                  boxShadow: "none",
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
  
          <h2>Funcionalidades</h2>
  
          <div className="botao-container">
            <button
              onClick={() =>
                openModal(
                  "O administrador pode executar todas as funções do sistema, bem como: editar, incluir e excluir"
                )
              }
            >
              Administrador
            </button>
            <button
              onClick={() =>
                openModal(
                  "O operador apenas não pode excluir informações, mas pode editar e incluir"
                )
              }
            >
              Operador
            </button>
            <button
              onClick={() =>
                openModal(
                  "O visitante tem permissão apenas para visualizar o sistema e buscar informações"
                )
              }
            >
              Visitante
            </button>
          </div>
  
          <Footer />
        </div>
      </section>
  
      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>
              &times;
            </button>
            <p>{modalContent}</p>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Menu;
