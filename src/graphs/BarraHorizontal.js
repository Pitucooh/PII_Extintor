import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, ChartDataLabels);

const BarraHorizontal = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [{
      label: data.label,
      data: data.values,
      backgroundColor: [
        'rgba(11, 19, 84, 0.8)',
        'rgba(20, 34, 152, 0.8)',
      ],
      hoverBackgroundColor:[
        'rgba(11, 19, 84, 1)',
        'rgba(20, 34, 152, 1)',
      ],
      borderColor: [
        'rgba(11, 19, 84, 1)',
        'rgba(20, 34, 152, 1)',
      ],
      borderWidth: 1
    }]
  };

  return (
    <Bar 
      data={chartData}
      options={{
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          datalabels: {
            color: 'white', 
            font: { size: 14 }, 
            formatter: (value, context) => value, 
            anchor: 'center', 
            tooltip: { enabled: true }, 
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              color: 'rgba(0, 0, 0, 1)'
            },
            ticks: {
              color: 'rgba(0, 0, 0, 1)' 
            }
          },
          y: {
            title: {
              display: true,
              color: 'rgba(0, 0, 0, 1)'
            },
            ticks: {
              color: 'rgba(0, 0, 0, 1)' 
            }
          }
        },
      }}
    />
  );
};

export default BarraHorizontal;

