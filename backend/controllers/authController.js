const User = require('../models/User');
const bcrypt = require('bcrypt');

// Função para validar email
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Validações básicas
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Validação da senha
    if (password.length < 6) {
      return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres' });
    }

    // Validação do email
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Por favor, insira um e-mail válido' });
    }

    // Verifica se usuário ou email já existem (em uma única consulta)
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Nome de usuário já está em uso' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'E-mail já está em uso' });
      }
    }

    // Cria e salva o novo usuário (o hash é feito no pre-save hook do modelo)
    const user = new User({ username, password, email });
    await user.save();
    
    // Remove a senha antes de retornar o usuário
    user.password = undefined;
    
    res.status(201).json({ 
      message: 'Usuário registrado com sucesso!',
      user
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ 
      message: 'Erro ao se registrar no servidor',
      error: process.env.NODE_ENV === 'desenvolvimento' ? error.message : undefined
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    // Compara senhas com bcrypt
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    // Remove a senha antes de retornar
    user.password = undefined;
    
    res.json({ 
      message: 'Login bem-sucedido',
      userId: user._id,
      username: user.username,
      email: user.email,
      notificationsEnabled: user.notificationsEnabled
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      message: 'Erro ao logar no servidor',
      error: process.env.NODE_ENV === 'desenvolvimento' ? error.message : undefined
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { password, notificationsEnabled } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    if (password) {
      user.password = password; // O hook pre-save faz o hash
    }
    
    if (notificationsEnabled !== undefined) {
      user.notificationsEnabled = notificationsEnabled;
    }
    
    await user.save();
    
    // Remove a senha antes de retornar
    user.password = undefined;
    
    res.json({ 
      message: 'Usuário atualizado com sucesso',
      user
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ 
      message: 'Erro ao atualizar usuário no servidor',
      error: process.env.NODE_ENV === 'desenvolvimento' ? error.message : undefined
    });
  }
};