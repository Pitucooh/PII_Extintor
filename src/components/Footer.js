// src/components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#878787",
        color: "#fff",
        textAlign: "center",
        padding: "0px",
        fontSize: "14px",
        position: "flex",
        bottom: 0,
        left: 0,
        right: 0,
        boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.3)",
        zIndex: 1000,
        width: "100%",
      }}
    >
      <p>
        &copy; 2024 - Todos os direitos reservados. Contato:{" "}
        <a href="#" style={{ color: "#fff", textDecoration: "underline" }}>
          metrocptm.com
        </a>
      </p>
    </footer>
  );
};

export default Footer;