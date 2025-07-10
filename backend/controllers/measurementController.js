const Measurement = require('../models/Measurement');
const Tank = require('../models/Tank');
const User = require('../models/User');
const { sendAlertEmail } = require('../utils/emailSender');

exports.addMeasurement = async (req, res) => {
  try {
    const { tankId, distance } = req.body;
    
    const tank = await Tank.findById(tankId);
    if (!tank) {
      return res.status(404).json({ message: 'Reservatório não encontrado' });
    }
    
    // Calcula a altura da água,  assumindo a distancia do sensor até a superficie da água
    // garante que não seja negativa nem maior que o tanque
    const waterHeight = Math.max(0, Math.min(tank.height, tank.height - distance + 0));
    
    // Calcula o volume em litros, garantindo que não seja negativo
    const volume = Math.max(0, (waterHeight * tank.width * tank.length) / 1000);
    
    // Calcula a porcentagem, garantindo que fique entre 0% e 100%
    const percentage = Math.max(0, Math.min(100, (volume / tank.maxCapacity) * 100));
    
    const measurement = new Measurement({
      tankId,
      distance,
      volume,
      percentage
    });
    
    await measurement.save();
    
    // Checa se o alerta deve ser enviado
    if (percentage <= tank.alertThreshold) {
      const user = await User.findById(tank.userId);
      if (user.notificationsEnabled) {
        await sendAlertEmail(user.email, percentage, volume, tank.maxCapacity);
      }
    }
    
    res.status(201).json({ 
      message: 'Medição adicionada',
      measurement: {
        ...measurement.toObject(),
        maxCapacity: tank.maxCapacity
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro na adição da medição no servidor', error });
  }
};

exports.getMeasurements = async (req, res) => {
  try {
    const { tankId, limit } = req.query;
    
    const query = { tankId };
    const measurements = await Measurement.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) || 100);
    
    res.json(measurements);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter medição no servidor', error });
  }
};

exports.getCurrentStatus = async (req, res) => {
  try {
    const { tankId } = req.params;
    
    const tank = await Tank.findById(tankId);
    if (!tank) {
      return res.status(404).json({ message: 'Reservatório não encontrado' });
    }
    
    const measurement = await Measurement.findOne({ tankId })
      .sort({ createdAt: -1 });
    
    if (!measurement) {
      return res.status(404).json({ message: 'Nenhuma medição encontrada' });
    }
    
    res.json({
      percentage: measurement.percentage,
      volume: measurement.volume,
      maxCapacity: tank.maxCapacity,
      lastUpdated: measurement.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao localizar medição atual no servidor', error });
  }
};

exports.getConsumptionAverage = async (req, res) => {
  try {
    const { tankId, days = 7 } = req.query;
    
    const tank = await Tank.findById(tankId);
    if (!tank) {
      return res.status(404).json({ message: 'Reservatório não encontrado' });
    }

    // Calcula a data de início baseada no número de dias solicitado
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Busca as medições do período
    const measurements = await Measurement.find({
      tankId,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });

    if (measurements.length < 2) {
      return res.status(400).json({ 
        message: 'Dados insuficientes para calcular a média de consumo',
        minMeasurementsRequired: 2
      });
    }

    // Calcula o consumo total no período
    const firstMeasurement = measurements[0];
    const lastMeasurement = measurements[measurements.length - 1];
    const totalConsumption = firstMeasurement.volume - lastMeasurement.volume;

    // Calcula o período em horas
    const periodHours = (lastMeasurement.createdAt - firstMeasurement.createdAt) / (1000 * 60 * 60);

    // Calcula a média diária (em litros/dia)
    const dailyAverage = totalConsumption > 0 
      ? (totalConsumption / periodHours) * 24
      : 0;

    res.json({
      totalConsumption,
      dailyAverage,
      period: {
        start: firstMeasurement.createdAt,
        end: lastMeasurement.createdAt,
        days: periodHours / 24
      },
      measurementsCount: measurements.length
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao calcular média de consumo no servidor', 
      error: error.message 
    });
  }
};