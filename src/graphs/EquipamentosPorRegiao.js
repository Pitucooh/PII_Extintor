import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js';

// Registrar módulos necessários (não usamos Legend aqui)
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const EquipamentosPorRegiao = () => {
  const [dados, setDados] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    axios
      .get('http://localhost:3002/equipamentos-por-regiao')
      .then((response) => {
        const labels = response.data.map((item) => item.predio);
        const valores = response.data.map((item) => item.total);

        setDados({
          labels,
          datasets: [
            {
              label: 'Equipamentos',
              data: valores,
              backgroundColor: 'rgba(0, 23, 76, 0.8)',
              hoverBackgroundColor: 'rgba(0, 23, 76, 1)',
              hoverBorderColor: 'black',
              borderColor: 'rgba(0, 23, 76, 1)',
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => console.error('Erro ao buscar dados', error));
  }, []);

  const options = {
    responsive: true,
    indexAxis: 'y', // Altera para gráfico horizontal
    plugins: {
      legend: { display: true }, // Remove a legenda
      tooltip: { enabled: true }, // Exibir tooltip
      datalabels: {
        color: 'white'
      }
    },
    scales: {
      x: { title: { display: true, text: 'Quantidade' } },
      y: { title: { display: true, text: 'Região' } },
    },

  };

  return (
    <div style={{ width: '60%', margin: '0 auto' }}>
      <h2>Equipamentos por Região - Linha 2</h2>
      <Bar data={dados} options={options} />
    </div>
  );
};

export default EquipamentosPorRegiao;
