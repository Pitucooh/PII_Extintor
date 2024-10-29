import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 

// Registrar módulos necessários
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, ChartDataLabels);

const ValidadeEquipamento = () => {
  const [dados, setDados] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    axios
      .get('http://localhost:3002/validade-equipamentos')
      .then((response) => {
        const labels = response.data.map((item) => item.validade);
        const valores = response.data.map((item) => item.total);

        setDados({
          labels,
          datasets: [
            {
              label: 'Equipamentos por Região',
              data: valores,
              backgroundColor: [
                'rgba(11, 19, 84, 0.8)',
                'rgba(20, 34, 152, 0.8)',
                'rgba(22, 91, 170, 0.8)',
                'rgba(80, 0, 106, 0.8)',
                'rgba(161, 85, 185, 0.8)',
                'rgba(239, 144, 208, 0.8)',
                'rgba(255, 113, 162, 0.8)',
              ],
              hoverBackgroundColor:[
                'rgba(11, 19, 84, 1)',
                'rgba(20, 34, 152, 1)',
                'rgba(22, 91, 170, 1)',
                'rgba(80, 0, 106, 1)',
                'rgba(161, 85, 185, 1)',
                'rgba(239, 144, 208, 1)',
                'rgba(255, 113, 162, 1)',
              ],
              borderColor: [
                'rgba(11, 19, 84, 0.8)',
                'rgba(20, 34, 152, 0.8)',
                'rgba(22, 91, 170, 0.8)',
                'rgba(80, 0, 106, 0.8)',
                'rgba(161, 85, 185, 0.8)',
                'rgba(239, 144, 208, 0.8)',
                'rgba(255, 113, 162, 0.8)',
              ],
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => console.error('Erro ao buscar dados', error));
  }, []);

  const options = {
    indexAxis: 'x',
    responsive: true,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: 'white', // Cor do texto
        font: { size: 14 }, // Estilização do texto
        formatter: (value, context) => value, // Exibir o valor correspondente
        anchor: 'center', // Centralizar o texto dentro da fatia
        tooltip: { enabled: true }, // Exibir tooltip
      },
    },
  };

  return (
    <div style={{ width: '50%', margin: '0 auto' }}>
      <p>Validades por Ano</p>
      <Bar data={dados} options={options}/>
    </div>
  );
};

export default ValidadeEquipamento;
