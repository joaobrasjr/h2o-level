const API_URL = 'http://localhost:5000/api';

export const createOrUpdateTank = async (userId, { height, width, length, alertThreshold }) => {
  const response = await fetch(`${API_URL}/users/${userId}/tank`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ height, width, length, alertThreshold }),
  });
  
  if (!response.ok) {
    throw new Error('Falha ao salvar configuração do reservatório');
  }
  
  return response.json();
};

export const getTankConfig = async (userId) => {
  const response = await fetch(`${API_URL}/users/${userId}/tank`);
  
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Falha ao buscar configuração do reservatório');
  }
  
  return response.json();
};