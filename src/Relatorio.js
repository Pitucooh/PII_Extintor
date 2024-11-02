import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Pizza from './graphs/Pizza';
import BarraVertical from './graphs/BarraVertical';
import BarraHorizontal from './graphs/BarraHorizontal';
import './css/Relatorio.css'; 

const Relatorio = () => {
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState('');
  const [tituloGrafico, setTituloGrafico] = useState('');

    // Função para buscar dados do gráfico
    const fetchChartData = async (type, chartType) => {
      try {
          const response = await fetch(`http://localhost:3002/api/graficos?type=${type}`);
          console.log("Resposta completa da API:", response);
  
          if (!response.ok) {
              throw new Error(`Erro na API: ${response.statusText}`);
          }
  
          const data = await response.json();
          setChartData({
              labels: data.labels,
              values: data.values,
              label: type,
          });
          setChartType(chartType);
      } catch (error) {
          console.error('Erro ao carregar os dados do gráfico:', error);
      }
  };
  return (
    <div className="layout">
      <Header />
      <Navbar />
      <div className='modal-wrapper' style={{paddingTop: '150px'}}> 
        <div className="title-modal">
            <h3>Relatórios</h3>
        </div>
      </div>
      <div className="container">
        <div>
          {/* Botões para selecionar o gráfico desejado */}
          <button onClick={() => {setTituloGrafico('Validade por Ano'); fetchChartData('validadePorAno', 'barra')}}>Validade por Ano</button>
          <button onClick={() => {setTituloGrafico('Quantidade por Prédio'); fetchChartData('tipoPorArea', 'pizza')}}>Tipo por Área</button>
          <button onClick={() => {setTituloGrafico('Validade por Ano'); fetchChartData('contagemPorFabricante', 'barraHorizontal')}}>Contagem por Fabricante</button>
          <button onClick={() => {setTituloGrafico('Validade por Ano'); fetchChartData('validadePorAno', 'barra')}}>Validade por Ano</button>
          <button onClick={() => {setTituloGrafico('Validade por Ano'); fetchChartData('tipoPorArea', 'pizza')}}>Tipo por Área</button>
          <button onClick={() => {setTituloGrafico('Validade por Ano'); fetchChartData('contagemPorFabricante', 'barraHorizontal')}}>Contagem por Fabricante</button>

          {/* Renderização condicional do gráfico com base no tipo selecionado */}
          <h2 style={{textAlign: 'center'}}>{tituloGrafico}</h2>
          {chartData && chartType === 'barra' && <BarraVertical data={chartData} />}
          {chartData && chartType === 'pizza' && <Pizza data={chartData}/>}
          {chartData && chartType === 'barraHorizontal' && <BarraHorizontal data={chartData} />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Relatorio;
