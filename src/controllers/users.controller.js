const Users = require('../models/users.model');
const { hashPassword } = require('../utils/hashPassword'); 

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
  const { username, password, rol_id } = req.body;

  try {
    let hashedPassword;
    if (password) {
      hashedPassword = await hashPassword(password); // Hashear la contraseña si se proporciona
    }

    const updatedUser = await Users.update(id, username, hashedPassword, rol_id);
    res.status(200).json({ message: 'Usuario actualizado correctamente.', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un usuario
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
  updateUser,
  deleteUser,
};