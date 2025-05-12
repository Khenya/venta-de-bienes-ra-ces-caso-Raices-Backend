const Roles = require('../models/roles.model');

const getAllRoles = async (req, res) => {
  try {
    const roles = await Roles.getAll();
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllRoles
};