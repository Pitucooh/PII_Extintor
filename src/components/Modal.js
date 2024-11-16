import React from 'react';
import './css/Modal.css'; // Estilo do modal

const Modal = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <button onClick={onClose} className="close-button">X</button>
        </div>
        <div className="modal-content">
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
