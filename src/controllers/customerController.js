const Customer = require('../models/customer.model');

const createCustomer = async (req, res) => {
  try {
    const { ci, name, phone, property_id } = req.body;

    if (!ci || !name || !property_id) {
      return res.status(400).json({ message: "Campos obligatorios: ci, name, property_id" });
    }

    const customer = await Customer.create({ ci, name, phone });

    await Customer.linkToProperty(customer.customer_id, property_id);

    res.status(201).json({
      message: "Cliente agregado y asociado al inmueble",
      customer
    });
  } catch (error) {
    console.error("Error al agregar cliente:", error.message);
    res.status(500).json({ message: "No se pudo agregar el cliente" });
  }
};

module.exports = { createCustomer };