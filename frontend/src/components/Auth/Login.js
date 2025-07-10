import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login as apiLoginService } from '../../services/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login: contextLogin } = useAuth();
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
      // Validações do frontend antes da requisição
      if (!email || !password) {
        throw new Error('E-mail e senha são obrigatórios');
      }

      if (!validateEmail(email)) {
        throw new Error('Por favor, insira um e-mail válido');
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      // Chamada para o serviço de API
      const userData = await apiLoginService(email, password);
      
      // Chamada para o contexto de autenticação
      contextLogin(userData);
      navigate('/dashboard');
    } catch (err) {
      // Trata erros de validação diferente de erros de API
      const errorMessage = err.message.includes('Falha no login') 
        ? 'E-mail ou senha incorretos' 
        : err.message;
      
      setError(errorMessage);
      console.error('Erro no login:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <h1>H2O Level</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <div>
          <label>E-mail</label>
          <input
            type="email"  //type="email" para melhor suporte mobile
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
          </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Carregando...' : 'Login'}
        </button>
      </form>
      <p>
        Não tem uma conta? <a href="/register">Criar</a>
      </p>
    </div>
  );
}

export default Login;