import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas';
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
  const [showExportButton, setShowExportButton] = useState(false);

  const exportChartToPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const chartElement = document.getElementById('chart-container');
  
    if (chartElement) {
      html2canvas(chartElement, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 180;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save('Grafico.pdf');
      });
    }
  };
  
  const exportReportToPDF = () => {
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const reportElement = document.getElementById('report-container');
  
    if (!reportElement) return;
  
    // Obtendo os dados da tabela
    const rows = Array.from(reportElement.getElementsByTagName('tr'));
    const columns = rows[0].getElementsByTagName('th');
  
    // Configurando os dados para a tabela
    const tableData = rows.slice(1).map(row => {
      const cells = row.getElementsByTagName('td');
      return Array.from(cells).map(cell => (cell.innerText !== '') ? cell.innerText : '-');
    });
  
    // Adicionando a tabela ao PDF
    pdf.autoTable({
      head: [Array.from(columns).map(th => th.innerText)],
      body: tableData,
      margin: { top: 20, left: 10, right: 10, bottom: 10 },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'auto', 
        fontSize: 10,
        valign: 'middle',
        halign: 'center',
      },
    });
  
    pdf.save('Relatorio.pdf');
  };

  // Função para buscar dados do relatorio
  const fetchReportData = async (type) => {
    try {
      const response = await fetch(`http://localhost:3002/api/relatorios?type=${type}`);
      const data = await response.json();
      setReportData(data);
  
      if (data.length > 0) {
        setColumns(Object.keys(data[0]));
      } else {
        setColumns([]); 
      }
      setShowExportButton(true);
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
        setShowExportButton(true);
    } catch (error) {
        console.error('Erro ao carregar os dados do gráfico:', error);
    }
  };
  return (
    <div className="layout">
      <Header />
      <Navbar />
      
      <div className="modal-wrapper" style={{ paddingTop: '150px' }}> 
        <div className="title-modal">
          <h3>Relatórios</h3>
        </div>
      </div>
      
      <div className="container">
        {/* Container de Gráficos */}
        <div className="section-container">
          <h3>Gráficos</h3>
          <button onClick={() => { setTituloGrafico('Validade por Ano'); fetchChartData('validadePorAno', 'barra'); }}>Validade por Ano</button>
          <button onClick={() => { setTituloGrafico('Quantidade por Tipo'); fetchChartData('totalPorTipo', 'pizza'); }}>Tipo por Área</button>
          <button onClick={() => { setTituloGrafico('Quantidade por Prédio'); fetchChartData('totalPorPredio', 'barraHorizontal'); }}>Contagem por Prédio</button>
          <button onClick={() => { setTituloGrafico('Vencimento Anual'); fetchChartData('validadeNoAno', 'pizza'); }}>Tipos de Equipamentos que Vencem no Ano</button>
          <button onClick={() => { setTituloGrafico('Contagem por Fabricante'); fetchChartData('contagemPorFabricante', 'barra'); }}>Contagem por Fabricante</button>
          
          <div id="chart-container">
            <h2>{tituloGrafico}</h2>
            {chartData && chartType === 'barra' && <BarraVertical data={chartData} />}
            {chartData && chartType === 'pizza' && <Pizza data={chartData} />}
            {chartData && chartType === 'barraHorizontal' && <BarraHorizontal data={chartData} />}
          </div>
          
          {chartData && (
            <button className="export-button" onClick={exportChartToPDF}>Exportar Gráfico para PDF</button>
          )}
        </div>
  
        {/* Container de Relatórios */}
        <div className="section-container">
          <h3>Relatórios</h3>
          <button onClick={() => fetchReportData('validadePorAno')}>Validade por Ano</button>
          <button onClick={() => fetchReportData('tipoPorArea')}>Tipo por Área</button>
          <button onClick={() => fetchReportData('naoConformidades')}>Não Conformidades</button>
          <button onClick={() => fetchReportData('validadeNoAno')}>Equipamentos que Vencem no Ano</button>
          
          <div id="report-container">
            {reportData && (
              <table>
                <thead>
                  <tr>
                    {columns.map((column, index) => (
                      <th key={index}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((column, colIndex) => (
                        <td key={colIndex}>
                          {item[column] != null ? item[column] : '-'} 
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {reportData && (
            <button className="export-button" onClick={exportReportToPDF}>Exportar Relatório para PDF</button>
          )}
        </div>
      </div>
  
      <Footer />
    </div>
  );
  
};

export default Relatorio;
