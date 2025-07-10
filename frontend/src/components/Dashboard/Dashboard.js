import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import CurrentStatus from './CurrentStatus';
import { getTankConfig } from '../../services/tankService';
import { getCurrentStatus } from '../../services/measurementService';

function Dashboard() {
  const { user } = useAuth();
  const [tankConfig, setTankConfig] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (user) {
          const tank = await getTankConfig(user.userId);
          setTankConfig(tank);
          
          if (tank) {
            const status = await getCurrentStatus(tank._id);
            setCurrentStatus(status || { percentage: 0, volume: 0 });
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return (
    <div className="dashboard-content">
      <h1>Dashboard</h1>
      {tankConfig && currentStatus ? (
        <CurrentStatus 
          percentage={currentStatus.percentage} 
          volume={currentStatus.volume} 
          maxCapacity={tankConfig.maxCapacity} 
        />
      ) : (
        <p>Nenhum reservatório configurado.</p>
      )}
    </div>
  );
}

export default Dashboard;