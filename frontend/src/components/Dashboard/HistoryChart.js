import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTankConfig } from '../../services/tankService';
import { getMeasurements } from '../../services/measurementService';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function HistoryChart() {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMeasurements = async () => {
      try {
        setLoading(true);
        if (user) {
          const tank = await getTankConfig(user.userId);
          if (tank) {
            const measurementsData = await getMeasurements(tank._id, 30);
            setMeasurements(measurementsData || []);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMeasurements();
  }, [user]);

  if (loading) return <div className="chart-container">Carregando gráfico...</div>;
  if (error) return <div className="chart-container">Erro: {error}</div>;

  if (!measurements || measurements.length === 0) {
    return <div className="chart-container">Nenhum dado disponível para o gráfico</div>;
  }

// Ordena as medições da mais recente para a mais antiga
  const sortedMeasurements = [...measurements].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  const chartData = {
  labels: sortedMeasurements.map(m => {
    const date = new Date(m.createdAt);
    return date.toLocaleTimeString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }),
  datasets: [
    {
      label: 'Nível de Água (%)',
      data: sortedMeasurements.map(m => m.percentage),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.3,
      fill: true
    },
    {
      label: 'Volume (L)',
      data: sortedMeasurements.map(m => m.volume),
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      tension: 0.3,
      fill: false
    }
  ]
};

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Histórico do Reservatório',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw.toFixed(1)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Valores'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Horário'
        }
      }
    }
  };

  return (
    <div className="chart-container" style={{ margin: '20px 0' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default HistoryChart;