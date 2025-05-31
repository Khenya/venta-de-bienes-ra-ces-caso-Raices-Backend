const Installment = require('../models/installment.model');

const getInstallmentsByCredit = async (req, res) => {
  try {
    const installments = await Installment.getByCreditId(req.params.creditId);
    res.status(200).json(installments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const payInstallment = async (req, res) => {
  try {
    const { installmentId } = req.params;
    const paidDate = new Date();

    const updatedInstallment = await Installment.markAsPaid(installmentId, paidDate);
    res.status(200).json({ message: 'Cuota marcada como pagada', installment: updatedInstallment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getInstallmentsByCredit,
  payInstallment,
};