import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTankConfig } from '../../services/tankService';
import { getMeasurements } from '../../services/measurementService';

function ConsumptionAverage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(1);

  useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      if (user) {
        const tank = await getTankConfig(user.userId);
        if (tank) {
          const allMeasurements = await getMeasurements(tank._id, 100);
          
          // Filtra medições pelo período selecionado
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - (days - 1));
          cutoffDate.setHours(0, 0, 0, 0);
          
          const periodMeasurements = allMeasurements.filter(m => 
            new Date(m.createdAt) >= cutoffDate
          );

          if (periodMeasurements.length === 0) {
            setData({ insufficientData: true });
            return;
          }

          // Ordena por data (mais antigo primeiro)
          const sorted = [...periodMeasurements].sort((a, b) => 
            new Date(a.createdAt) - new Date(b.createdAt)
          );

          // Remove apenas valores repetidos CONSECUTIVOS
          const filteredMeasurements = [];
          let lastVolume = null;
          
          sorted.forEach(m => {
            if (m.volume !== lastVolume) {
              filteredMeasurements.push(m);
              lastVolume = m.volume;
            }
          });

          // Calcula consumo comparando sempre com 3.0L
          let totalConsumption = 0;
          let daysWithMeasurements = new Set();

          filteredMeasurements.forEach(m => {
            const measurementDate = new Date(m.createdAt).toDateString();
            daysWithMeasurements.add(measurementDate);
            
            // Calcula diferença em relação a 3.0L (tanque cheio)
            const consumption = 3.0 - m.volume;
            if (consumption > 0) {
              totalConsumption += consumption;
            }
          });

          // Cálculo da média diária
          const daysCount = daysWithMeasurements.size;
          const dailyAverage = daysCount > 0 
            ? totalConsumption / daysCount 
            : 0;

          setData({
            totalConsumption,
            dailyAverage,
            measurementsCount: periodMeasurements.length,
            daysWithMeasurements: daysCount,
            period: {
              start: sorted[0]?.createdAt,
              end: sorted[sorted.length-1]?.createdAt
            }
          });
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [user, days]);
  const handleDaysChange = (e) => {
    setDays(parseInt(e.target.value));
  };

  if (loading) return <div className="loading">Calculando...</div>;
  if (error) return <div className="error">Erro: {error}</div>;

  if (!data || data.insufficientData) {
    return (
      <div className="consumption-container">
        <h3>Média de Consumo</h3>
        <div className="info-message">
          {data?.measurementsCount === 0 ? (
            <p>Nenhuma medição disponível no período selecionado</p>
          ) : (
            <p>Dados insuficientes para cálculo</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="consumption-container">
      <h3>Média de Consumo</h3>
      
      <div className="period-selector">
        <label>Período analisado:</label>
        <select value={days} onChange={handleDaysChange}>
          <option value="1">Hoje</option>
          <option value="7">Últimos 7 dias</option>
          <option value="30">Últimos 30 dias</option>
        </select>
      </div>

      <div className="consumption-metrics">
        <div className="metric-card">
          <span className="metric-label">Consumo Total: </span>
          <span className="metric-value">
            {data.totalConsumption.toFixed(2)} <span className="unit">litros</span>
          </span>
          <div className="metric-subtext">
            {data.daysWithMeasurements} dia{data.daysWithMeasurements !== 1 ? 's' : ''} com medições
          </div>
        </div>
        
        <div className="metric-card highlight">
          <span className="metric-label">Média Diária: </span>
          <span className="metric-value">
            {data.dailyAverage.toFixed(2)} <span className="unit">litros/dia</span>
          </span>
          <div className="metric-subtext">
            {data.measurementsCount} medições analisadas
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsumptionAverage;