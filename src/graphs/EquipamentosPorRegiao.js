import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 

// Registrar os módulos necessários
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

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
              backgroundColor: [
                'rgba(0, 94, 184)',
                'rgba(0, 122, 83)',
                'rgba(239, 51, 64',
                'rgba(141, 144, 147)',
              ],
              borderColor: 'rgba(0, 122, 83, 1)',
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
      datalabels: {
        color: 'white', // Cor do texto
        font: { size: 14 }, // Estilização do texto
        formatter: (value, context) => value, // Exibir o valor correspondente
        anchor: 'center', // Centralizar o texto dentro da fatia
      },
    },
  };

  return (
    <div style={{ width: '25%', margin: '0 auto' }}>
      <p>Equipamentos por Linha</p>
      <Pie data={dados} options={options} />
    </div>
  )
};

export default EquipamentosPorRegiao;