import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createOrUpdateTank, getTankConfig } from '../../services/tankService';

function ConfigTank() {
  const { user } = useAuth();
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('20');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    const loadTankConfig = async () => {
      if (user) {
        try {
          const tank = await getTankConfig(user.userId);
          if (tank) {
            setHeight(formatDecimal(tank.height));
            setWidth(formatDecimal(tank.width));
            setLength(formatDecimal(tank.length));
            setAlertThreshold(formatDecimal(tank.alertThreshold));
          }
        } catch (error) {
          console.error('Erro ao carregar configuração do reservatório:', error);
        }
      }
    };
    
    loadTankConfig();
  }, [user]);
  
  // Formata número para exibição com vírgula
  const formatDecimal = (value) => {
    return value.toString().replace('.', ',');
  };
  
  // Converte string com vírgula para número
  const parseDecimal = (value) => {
    const parsed = parseFloat(value.replace(',', '.'));
    return isNaN(parsed) ? 0 : parsed;
  };
  
  const validateInputs = () => {
    const newErrors = {};
    const numHeight = parseDecimal(height);
    const numWidth = parseDecimal(width);
    const numLength = parseDecimal(length);
    const numAlertThreshold = parseDecimal(alertThreshold);
    
    if (isNaN(numHeight)) {
      newErrors.height = 'Altura deve ser um número';
    } else if (numHeight <= 0) {
      newErrors.height = 'Altura deve ser positiva';
    }
    
    if (isNaN(numWidth)) {
      newErrors.width = 'Largura deve ser um número';
    } else if (numWidth <= 0) {
      newErrors.width = 'Largura deve ser positiva';
    }
    
    if (isNaN(numLength)) {
      newErrors.length = 'Comprimento deve ser um número';
    } else if (numLength <= 0) {
      newErrors.length = 'Comprimento deve ser positivo';
    }
    
    if (isNaN(numAlertThreshold)) {
      newErrors.alertThreshold = 'Limite do alerta deve ser um número';
    } else if (numAlertThreshold < 1 || numAlertThreshold > 100) {
      newErrors.alertThreshold = 'Limite deve ser entre 1 e 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNumberChange = (e, setter) => {
    const value = e.target.value;
    // Permite números, vírgula e até 2 casas decimais
    if (/^[0-9]*[,]?[0-9]{0,2}$/.test(value) || value === '') {
      setter(value);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      setMessage('Por favor, corrija os erros no formulário');
      return;
    }
    
    try {
      await createOrUpdateTank(user.userId, {
        height: height.replace(',', '.'),
        width: width.replace(',', '.'),
        length: length.replace(',', '.'),
        alertThreshold: alertThreshold.replace(',', '.')
      });
      setMessage('Configuração do reservatório salva com sucesso');
      setErrors({});
    } catch (error) {
      setMessage(error.message || 'Erro ao salvar a configuração do reservatório');
    }
  };
  
  return (
    <div className="config-container">
      <h1>Configuração do reservatório</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Altura (cm)</label>
          <input
            type="text"
            value={height}
            onChange={(e) => handleNumberChange(e, setHeight)}
            required
            placeholder="Ex: 51,64"
          />
          {errors.height && <span className="error">{errors.height}</span>}
        </div>
        <div>
          <label>Largura (cm)</label>
          <input
            type="text"
            value={width}
            onChange={(e) => handleNumberChange(e, setWidth)}
            required
            placeholder="Ex: 51,64"
          />
          {errors.width && <span className="error">{errors.width}</span>}
        </div>
        <div>
          <label>Comprimento (cm)</label>
          <input
            type="text"
            value={length}
            onChange={(e) => handleNumberChange(e, setLength)}
            required
            placeholder="Ex: 51,64"
          />
          {errors.length && <span className="error">{errors.length}</span>}
        </div>
        <div>
          <label>Limite do alerta (%)</label>
          <input
            type="text"
            value={alertThreshold}
            onChange={(e) => handleNumberChange(e, setAlertThreshold)}
            placeholder="Ex: 20,5"
          />
          {errors.alertThreshold && <span className="error">{errors.alertThreshold}</span>}
        </div>
        <button type="submit">Salvar configuração</button>
      </form>
      {message && <p className={Object.keys(errors).length ? "message error" : "message success"}>{message}</p>}
    </div>
  );
}

export default ConfigTank;