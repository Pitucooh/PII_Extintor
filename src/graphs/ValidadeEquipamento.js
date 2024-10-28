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
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 

// Registrar módulos necessários
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

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
                'rgba(11, 19, 84)',
                'rgba(20, 34, 152)',
                'rgba(22, 91, 170)',
                'rgba(80, 0, 106)',
                'rgba(161, 85, 185)',
                'rgba(239, 144, 208)',
                'rgba(255, 113, 162)',
              ],
              borderColor: 'white',
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => console.error('Erro ao buscar dados', error));
  }, []);

  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        color: 'white', // Cor do texto
        font: { size: 14 }, // Estilização do texto
        formatter: (value, context) => value, // Exibir o valor correspondente
        anchor: 'center', // Centralizar o texto dentro da fatia
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
