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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
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
              <h3>Mapa de São Paulo</h3>
              <p className="informative-text">
                <button className="dropdown-button" onClick={toggleDropdown}>
                  {isDropdownOpen ? "Fechar informações" : "Exibir dicas da linha verde"}
                </button>

                {isDropdownOpen && (
                  <div className="informative-dropdown-container">
                    <p>Você sabia que a linha verde também é conhecida como "Linha Paulista"? Pois percorre a Avenida Paulista, um dos principais centros comerciais da cidade.</p>
                  </div>
                )}
              </p>
              
              <div className="informative-container">
                <p>Aqui você pode explorar o entorno, verificar rotas e encontrar informações sobre estações e localidades</p>
              </div>
            </div>
          </div>
          <div className="map-container">
            <div className="map-responsive">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29250.581564906213!2d-46.62549888916015!3d-23.592757199999987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5c7469a57061%3A0x9a851b476126240b!2sTamanduate%C3%AD!5e0!3m2!1sen!2sbr!4v1731819335320!5m2!1sen!2sbr"
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
  
          
  
         

          {/* Novo Container */}
          <div className="new-container">
            <h3>Funcionalidades</h3>
            <p>
              Ao clicar nestes botões, você terá acesso á explicação de cada tipo de funcionalidade, exibindo quais funções você pode ou não efetiar, de acordo com seu usuário. 
            </p>
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
          </div>

          <Footer />
        </div>
      </section>
  
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
