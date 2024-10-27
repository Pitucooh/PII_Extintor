import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

// Registrar os módulos necessários
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EquipamentosPorRegiao = () => {
  const [dados, setDados] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    axios.get('http://localhost:3002/equipamentos-por-regiao')
      .then(response => {
        const labels = response.data.map(item => item.area);
        const valores = response.data.map(item => item.total);

        setDados({
          labels,
          datasets: [
            {
              label: 'Equipamentos por Região',
              data: valores,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      })
      .catch(error => console.error('Erro ao buscar dados', error));
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Equipamentos por Região' },
    },
    scales: {
      x: { type: 'category' },  // Define explicitamente o tipo de escala
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ width: '50%', margin: '0 auto' }}>
        <Bar data={dados} options={options} />
    </div>
  )
};

export default EquipamentosPorRegiao;