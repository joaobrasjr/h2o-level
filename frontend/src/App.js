import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ConfigUser from './components/Dashboard/ConfigUser';
import ConfigTank from './components/Dashboard/ConfigTank';
import Dashboard from './components/Dashboard/Dashboard';
import History from './components/Dashboard/History';
import HistoryChart from './components/Dashboard/HistoryChart';
import ConsumptionAverage from './components/Dashboard/ConsumptionAverage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/config-user" element={<Layout><ConfigUser /></Layout>} />
          <Route path="/config-tank" element={<Layout><ConfigTank /></Layout>} />
          <Route path="/history" element={<Layout><History /></Layout>} />
          <Route path="/history-chart" element={<Layout><HistoryChart /></Layout>} />
          <Route path="/consumption" element={<Layout><ConsumptionAverage /></Layout>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;