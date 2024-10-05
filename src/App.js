import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Alterado para Routes
import Busca from './Busca'; // Componente de busca

const App = () => {
  return (
    <Router>
      <div>
        <Routes> {/* Usando Routes em vez de Switch */}
          <Route path="/" element={<Busca />} /> {/* Usando element */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
