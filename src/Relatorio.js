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
  const [reportData, setReportData] = useState(null);
  const [columns, setColumns] = useState([]);

  const fetchReportData = async (type) => {
    try {
      const response = await fetch(`http://localhost:3002/api/relatorios?type=${type}`);
      const data = await response.json();
      setReportData(data);
  
      // Define as colunas dinamicamente com base nas chaves do primeiro objeto
      if (data.length > 0) {
        setColumns(Object.keys(data[0]));
      } else {
        setColumns([]); // Nenhuma coluna caso não haja dados
      }
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
    }
  };
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
          <h3>Gráficos</h3>
          <button onClick={() => {setTituloGrafico('Validade por Ano'); fetchChartData('validadePorAno', 'barra')}}>Validade por Ano</button>
          <button onClick={() => {setTituloGrafico('Quantidade por Tipo'); fetchChartData('totalPorTipo', 'pizza')}}>Tipo por Área</button>
          <button onClick={() => {setTituloGrafico('Quantidade por Prédio'); fetchChartData('totalPorPredio', 'barraHorizontal')}}>Contagem por Prédio</button>
          <button onClick={() => {setTituloGrafico('Vencimento Anual'); fetchChartData('validadeNoAno', 'pizza')}}>Tipos de equipamentos que vencem no ano</button>
          <button onClick={() => {setTituloGrafico('Contagem por Fabricante'); fetchChartData('contagemPorFabricante', 'barra')}}>Contagem por Fabricante</button>
          <button onClick={() => {setTituloGrafico('Validade por Ano'); fetchChartData('contagemPorFabricante', 'barraHorizontal')}}>Contagem por Fabricante</button>

          <h2 style={{textAlign: 'center', color: 'black', textDecoration: 'bold'}}>{tituloGrafico}</h2>
          {chartData && chartType === 'barra' && <BarraVertical data={chartData} />}
          {chartData && chartType === 'pizza' && <Pizza data={chartData}/>}
          {chartData && chartType === 'barraHorizontal' && <BarraHorizontal data={chartData} />}

          <h3>Relatórios</h3>
          <button onClick={() => fetchReportData('validadePorAno')}>Validade por Ano</button>
          <button onClick={() => fetchReportData('tipoPorArea')}>Tipo por Área</button>
          <button onClick={() => fetchReportData('naoConformidades')}>Não Conformidades</button>
          <button onClick={() => fetchReportData('validadeNoAno')}>Equipamentos que vencem no ano</button>

          {reportData && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th key={index} style={{ border: '1px solid #000000', padding: '8px', color: '#000000' }}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} style={{ border: '1px solid #000000', padding: '8px', color: '#000000'}}>
                        {item[column] != null ? item[column] : '-'} {/* Mostra '-' para valores nulos */}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Relatorio;
