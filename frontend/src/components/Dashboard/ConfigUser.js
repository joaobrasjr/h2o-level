import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUser } from '../../services/authService';

function ConfigUser() {
  const { user, login } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled ?? true);
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      setMessage('Senhas não coincidem');
      return;
    }
    
    try {
      // Atualiza o usuário no backend
      const response = await updateUser(user.userId, {
        password: password || undefined,
        notificationsEnabled
      });
      
      // Atualiza o contexto de autenticação com os novos dados
      login({
        ...user,
        notificationsEnabled: response.user.notificationsEnabled
      });
      
      setMessage('Configurações atualizadas com sucesso');
    } catch (error) {
      setMessage('Erro ao atualizar configurações');
      console.error('Erro ao atualizar usuário:', error);
    }
  };
  
  return (
    <div className="config-container">
      <h1>Configurações do usuário</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nova senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Confirme a nova senha</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
            />
            Ativar notificações do alerta por e-mail
          </label>
        </div>
        <button type="submit">Salvar alterações</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default ConfigUser;