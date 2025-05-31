const Credit = require('../models/credit.model');
const Installment = require('../models/installment.model');

const createCredit = async (req, res) => {
  try {
    const { totalAmount, interestNumber, installmentsCount } = req.body;

    // Validación mínima
    if (!totalAmount || !interestNumber || !installmentsCount) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const credit = await Credit.create({ totalAmount, interestNumber, installmentsCount });

    const installmentAmount = totalAmount / installmentsCount;

    const today = new Date();
    const dayOfMonth = today.getDate();

    for (let i = 1; i <= installmentsCount; i++) {
      const year = today.getFullYear();
      const baseMonth = today.getMonth();
      const paymentMonth = baseMonth + i;

      const safeDate = new Date(year, paymentMonth, 1);

      const lastDay = new Date(safeDate.getFullYear(), safeDate.getMonth() + 1, 0).getDate();
      safeDate.setDate(Math.min(dayOfMonth, lastDay));

      await Installment.create({
        creditId: credit.credit_id,
        amount: installmentAmount,
        installmentNumber: i,
        paymentDate: safeDate
      });
    }

    res.status(201).json({ message: "Crédito y cuotas creados correctamente", credit });
  } catch (error) {
    console.error("Error al crear crédito:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getAllCredits = async (req, res) => {
  try {
    const credits = await Credit.getAll();
    res.status(200).json(credits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCreditById = async (req, res) => {
  try {
    const credit = await Credit.getById(req.params.id);
    if (!credit) {
      return res.status(404).json({ error: 'Crédito no encontrado' });
    }
    res.status(200).json(credit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCredit,
  getAllCredits,
  getCreditById,
};