const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const tankRoutes = require('./routes/tankRoutes');
const measurementRoutes = require('./routes/measurementRoutes');

const app = express();

// Coneção ao banco de dados
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', tankRoutes);
app.use('/api', measurementRoutes);

// Rota simples para testes
app.get('/', (req, res) => {
  res.send('H2O Level API está rodando');
});

module.exports = app;