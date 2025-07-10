const API_URL = 'http://localhost:5000/api/auth';

export const register = async (username, password, email) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Falha ao se registrar');
  }
  
  // Retorna os dados do usuário sem mensagem de sucesso
  const userData = await response.json();
  return userData;
};

// Login
export const login = async (email, password) => {  
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }), 
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Falha no login');
  }
  
  return response.json();
};

export const updateUser = async (userId, { password, notificationsEnabled }) => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, notificationsEnabled }),
  });
  
  if (!response.ok) {
    throw new Error('Falha ao atualizar');
  }
  
  return response.json();
};