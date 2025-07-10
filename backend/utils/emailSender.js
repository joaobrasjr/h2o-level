const nodemailer = require('nodemailer');
const User = require('../models/User');

// Configurações do seu serviço de e-mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'INSIRA_SEU_EMAIL',
    pass: process.env.EMAIL_PASS || 'INSIRA_SUA_SENHA'
  }
});

exports.sendAlertEmail = async (to, percentage, volume, maxCapacity) => {
  try {
    // Verifica se o usuário tem notificações habilitadas
    const user = await User.findOne({ email: to });
    if (!user || !user.notificationsEnabled) {
      console.log('Notificações desativadas para:', to);
      return;
    }

    const mailOptions = {
      from: 'h2olevel@example.com',
      to,
      subject: 'H2O Level Alert - Baixo nível de água',
      text: `Aviso: Seu reservatório está com ${percentage.toFixed(2)}% da capacidade.\n\n` +
            `Volume atual: ${volume.toFixed(2)}L / ${maxCapacity}L\n\n` +
            `Por favor, verifique a situação do reservatório.`
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Alerta de e-mail enviado para:', to);
  } catch (error) {
    console.error('Erro no envio do e-mail:', error);
  }
};