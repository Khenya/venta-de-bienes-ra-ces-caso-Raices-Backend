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

const getInstallmentsByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    if (!propertyId) {
      return res.status(400).json({ error: "ID de propiedad es requerido" });
    }

    const installments = await Installment.getByPropertyId(propertyId);
    
    if (installments.length === 0) {
      return res.status(200).json({ 
        message: "No se encontraron pagos para esta propiedad",
        installments: [] 
      });
    }

    res.status(200).json({
      message: `Se encontraron ${installments.length} pagos`,
      installments
    });
  } catch (error) {
    console.error("Error al obtener pagos por propiedad:", error);
    res.status(500).json({ error: error.message });
  }
};

const getPaymentSummaryByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    if (!propertyId) {
      return res.status(400).json({ error: "ID de propiedad es requerido" });
    }

    const summary = await Installment.getPaymentSummaryByPropertyId(propertyId);
    
    res.status(200).json({
      message: "Resumen de pagos obtenido exitosamente",
      summary
    });
  } catch (error) {
    console.error("Error al obtener resumen de pagos:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getInstallmentsByCredit,
  payInstallment,
  getInstallmentsByProperty,
  getPaymentSummaryByProperty
};