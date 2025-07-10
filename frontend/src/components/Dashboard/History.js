import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTankConfig } from '../../services/tankService';
import { getMeasurements } from '../../services/measurementService';

function History() {
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
            const measurementsData = await getMeasurements(tank._id, 100);
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

  if (loading) return <div>Carregando medições...</div>;
  if (error) return <div>Erro: {error}</div>;

  if (!measurements || measurements.length === 0) {
    return (
      <div className="history-container">
        <h2>Histórico de medições</h2>
        <p>Nenhuma medição disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h2>Histórico de medições</h2>
      <table className="history-table">
        <thead>
          <tr>
            <th>Data/Hora</th>
            <th>Percentual</th>
            <th>Volume (L)</th>
          </tr>
        </thead>
        <tbody>
          {measurements.map((m, i) => {
            const date = new Date(m.createdAt);
            return (
              <tr key={`measurement-${i}`}>
                <td>{date.toLocaleString('pt-BR')}</td>
                <td>{m.percentage.toFixed(1)}%</td>
                <td>{m.volume.toFixed(1)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default History;