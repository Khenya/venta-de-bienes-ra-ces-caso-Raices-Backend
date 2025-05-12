const Users = require('../models/users.model');
const hashPassword = require('../utils/hashPassword'); 

const getAllUsers = async (req, res) => {
  try {
    const users = await Users.getAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getUserById = async (req, res) => {
  try {
    const user = await Users.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    if (!password) {
      return res.status(400).json({ error: "La contraseña es requerida" });
    }

    const user = await Users.getById(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const updatedUser = await Users.updatePasswordById(id, password);

    res.status(200).json({ message: 'Contraseña actualizada correctamente.', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, password, confirmPassword, role_id } = req.body;

    if (!username || !password || !role_id) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    const userData = { username, password, role_id };

    const newUser = await Users.create(userData);
    
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({ 
      message: 'Usuario creado correctamente.',
      user: userWithoutPassword 
    });
  } catch (err) {
    res.status(500).json({ 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await Users.delete(req.params.id); 
    res.status(200).json({ message: 'Usuario eliminado correctamente.', user: deletedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};