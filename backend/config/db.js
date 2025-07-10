const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/h2olevel', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado ao MongoDB...');
  } catch (err) {
    console.error('Falha ao se conectar ao banco:', err);
    process.exit(1);
  }
};

module.exports = connectDB;