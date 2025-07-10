const Tank = require('../models/Tank');
const User = require('../models/User');
const { sendAlertEmail } = require('../utils/emailSender');

exports.createOrUpdateTank = async (req, res) => {
  try {
    const { userId } = req.params;
    let { height, width, length, alertThreshold } = req.body;
    
    // Função para converter string com vírgula para número
    const parseNumber = (value) => {
      if (typeof value === 'string') {
        return parseFloat(value.replace(',', '.'));
      }
      return value;
    };
    
    // Converter os valores
    height = parseNumber(height);
    width = parseNumber(width);
    length = parseNumber(length);
    alertThreshold = parseNumber(alertThreshold);
    
    // Verifica se os valores são números positivos
    if (isNaN(height) || height <= 0) {
      return res.status(400).json({ message: 'Altura deve ser um número positivo' });
    }
    if (isNaN(width) || width <= 0) {
      return res.status(400).json({ message: 'Largura deve ser um número positivo' });
    }
    if (isNaN(length) || length <= 0) {
      return res.status(400).json({ message: 'Comprimento deve ser um número positivo' });
    }
    
    // Verifica se o alerta é um número entre 1 e 100
    if (isNaN(alertThreshold) || alertThreshold < 1 || alertThreshold > 100) {
      return res.status(400).json({ message: 'Limite do alerta deve ser um número entre 1 e 100' });
    }
    
    // Arredonda para 2 casas decimais
    height = parseFloat(height.toFixed(2));
    width = parseFloat(width.toFixed(2));
    length = parseFloat(length.toFixed(2));
    alertThreshold = parseFloat(alertThreshold.toFixed(2));
    
    // Calcula a capacidade máxima em litros
    const maxCapacity = (height * width * length) / 1000;
    
    let tank = await Tank.findOne({ userId });
    
    if (tank) {
      tank.height = height;
      tank.width = width;
      tank.length = length;
      tank.maxCapacity = maxCapacity;
      tank.alertThreshold = alertThreshold;
    } else {
      tank = new Tank({
        userId,
        height,
        width,
        length,
        maxCapacity,
        alertThreshold: alertThreshold || 20
      });
    }
    
    await tank.save();
    res.json({ message: 'Configuração do reservatório salva', tank });
  } catch (error) {
    res.status(500).json({ message: 'Erro na configuração do reservatório no servidor', error });
  }
};

exports.getTankConfig = async (req, res) => {
  try {
    const { userId } = req.params;
    const tank = await Tank.findOne({ userId });
    
    if (!tank) {
      return res.status(404).json({ message: 'Configuração do reservatório não encontrada' });
    }
    
    res.json(tank);
  } catch (error) {
    res.status(500).json({ message: 'Erro na localização da configuração do reservatório no servidor', error });
  }
};