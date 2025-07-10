import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Validações do frontend
      if (!username || !password || !email) {
        throw new Error('Todos os campos são obrigatórios');
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      if (!validateEmail(email)) {
        throw new Error('Por favor, insira um e-mail válido');
      }

      // Chamada ao serviço de registro
      await register(username, password, email);
      
      // Verifica se deu certo
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
      
    } catch (err) {
      console.error('Erro no registro:', err);
      
      // Tratamento especial para mensagens do servidor
      const errorMessage = err.message.includes('Falha ao se registrar')
        ? 'Erro ao registrar. Tente novamente.'
        : err.message;
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <h1>Registro</h1>
      {success ? (
        <p>Registro realizado com sucesso! Redirecionando para a tela de login...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}
          <div>
            <label>Nome</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
            <small>A senha deve ter pelo menos 6 caracteres</small>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Carregando...' : 'Cadastrar'}
          </button>
        </form>
      )}
      <p>
        Já possui uma conta? <a href="/">Logar</a>
      </p>
    </div>
  );
}

export default Register;