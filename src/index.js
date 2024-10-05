import React from 'react'; // Importação do React
import ReactDOM from 'react-dom/client'; // Importando ReactDOM
import App from './App'; // Importando o componente App do arquivo App.js
import './index.css'; // Importando o CSS

// Renderizando o componente App no elemento root do HTML
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
