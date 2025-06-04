const Credit = require('../models/credit.model');
const Installment = require('../models/installment.model');
const pool = require('../config/db'); // importante

const createCredit = async (req, res) => {
  try {
    const {
      totalAmount,
      interestNumber,
      installmentsCount,
      propertyId,
      customerId,
      notificationId
    } = req.body;

    if (!totalAmount || !interestNumber || !installmentsCount || !propertyId) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const credit = await Credit.create({ totalAmount, interestNumber, installmentsCount });

    const installmentAmount = Math.round(totalAmount / installmentsCount); 
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

    const insertFields = ['property_id', 'credit_id'];
    const insertValues = [propertyId, credit.credit_id];
    let placeholders = ['$1', '$2'];
    let index = 3;

    if (customerId) {
      insertFields.push('customer_id');
      insertValues.push(customerId);
      placeholders.push(`$${index++}`);
    }

    if (notificationId) {
      insertFields.push('notification_id');
      insertValues.push(notificationId);
      placeholders.push(`$${index++}`);
    }

    const insertQuery = `
      INSERT INTO notification_customer_property (${insertFields.join(', ')})
      VALUES (${placeholders.join(', ')})
    `;

    await pool.query(insertQuery, insertValues);

    res.status(201).json({
      message: "Crédito, cuotas y relación con propiedad creados exitosamente",
      credit
    });

  } catch (error) {
    console.error("❌ Error al crear crédito:", error);
    res.status(500).json({ error: "Error al crear crédito" });
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
  getCreditById,
};