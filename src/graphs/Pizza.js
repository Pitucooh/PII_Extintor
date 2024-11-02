import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Pizza = ({ data, title }) => {
  const chartData = {
    labels: data.labels,
    datasets: [{
      label: data.label,
      data: data.values,
      backgroundColor: [
        'rgba(11, 19, 84, 0.8)',
        'rgba(20, 34, 152, 0.8)',
        'rgba(22, 91, 170, 0.8)',
        'rgba(80, 0, 106, 0.8)',
        'rgba(161, 85, 185, 0.8)',
        'rgba(239, 144, 208, 0.8)',
        'rgba(255, 113, 162, 0.8)'
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
        'rgba(11, 19, 84, 1)',
        'rgba(20, 34, 152, 1)',
        'rgba(22, 91, 170, 1)',
        'rgba(80, 0, 106, 1)',
        'rgba(161, 85, 185, 1)',
        'rgba(239, 144, 208, 1)',
        'rgba(255, 113, 162, 1)',
      ],
      borderWidth: 1
    }]
  };

  return (
    <Pie 
      data={chartData} 
      options={{
        indexAxis: 'x',
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title, // Usa o título passado como propriedade
            font: {
              size: 20,
              family: 'Arial',
              weight: 'bold',
            },
            color: 'rgba(0, 0, 0, 0.8)',
          },
          legend: {
            labels: {
              color: 'rgba(0, 0, 0, 1)', 
            }
          },
          datalabels: {
            color: 'white', 
            font: { size: 14 }, 
            formatter: (value, context) => value, 
            anchor: 'center', 
            tooltip: { enabled: true }, 
          },
        },
      }}
    />
  );
};

export default Pizza;
