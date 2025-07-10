const API_URL = 'http://localhost:5000/api';

export const addMeasurement = async (tankId, distance) => {
  const response = await fetch(`${API_URL}/measurements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tankId, distance }),
  });
  
  if (!response.ok) {
    throw new Error('Falha ao adicionar medição');
  }
  
  return response.json();
};

export const getMeasurements = async (tankId, limit = 30) => {
  const response = await fetch(`${API_URL}/measurements?tankId=${tankId}&limit=${limit}`);
  
  if (!response.ok) {
    throw new Error('Falha ao buscar medições');
  }
  
  return response.json();
};

export const getCurrentStatus = async (tankId) => {
  const response = await fetch(`${API_URL}/tanks/${tankId}/status`);
  
  if (!response.ok) {
    throw new Error('Falha ao buscar o nível atual');
  }
  
  return response.json();
};

export const getConsumptionAverage = async (tankId, days = 7) => {
  const response = await fetch(`${API_URL}/consumption-average?tankId=${tankId}&days=${days}`);
  
  if (!response.ok) {
    throw new Error('Falha ao calcular média de consumo');
  }
  
  return response.json();
};