const Customer = require('../models/customer.model');

const createCustomer = async (req, res) => {
  try {
    const { ci, name, phone } = req.body;

    if (!ci || !name) {
      return res.status(400).json({ message: "Campos obligatorios: ci, name" });
    }

    const customer = await Customer.create({ ci, name, phone });
    res.status(201).json({ message: "Cliente agregado", customer });
  } catch (error) {
    console.error("Error al agregar cliente:", error.message);
    res.status(500).json({ message: "No se pudo agregar el cliente" });
  }
};

module.exports = { createCustomer };
