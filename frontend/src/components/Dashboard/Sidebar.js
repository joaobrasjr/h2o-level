import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="sidebar">
      <div className="user-info">
        <p>Bem vindo, {user?.username}</p>
      </div>
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/config-user">Configuração do usuário</Link></li>
          <li><Link to="/config-tank">Configuração do reservatório</Link></li>
          <li><Link to="/history">Histórico de medições</Link></li>
          <li><Link to="/history-chart">Gráfico</Link></li>
          <li><Link to="/consumption">Média de Consumo</Link></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;