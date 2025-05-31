const pool = require('../config/db');

const Installment = {
  create: async ({ creditId, amount, installmentNumber, paymentDate }) => {
    const res = await pool.query(
      `INSERT INTO installment (credit_id, amount, installment_number, payment_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [creditId, amount, installmentNumber, paymentDate]
    );
    return res.rows[0];
  },

  getByCreditId: async (creditId) => {
    const res = await pool.query(
      `SELECT * FROM installment WHERE credit_id = $1 ORDER BY installment_number`,
      [creditId]
    );
    return res.rows;
  },

  markAsPaid: async (installmentId, paidDate) => {
    const res = await pool.query(
      `UPDATE installment SET paid_date = $1 WHERE installment_id = $2 RETURNING *`,
      [paidDate, installmentId]
    );
    return res.rows[0];
  },

  getOverdue: async () => {
    const res = await pool.query(
      `SELECT * FROM installment WHERE paid_date IS NULL AND payment_date < CURRENT_DATE`
    );
    return res.rows;
  },
};

module.exports = Installment;