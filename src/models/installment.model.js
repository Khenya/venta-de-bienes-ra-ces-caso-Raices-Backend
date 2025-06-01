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

  getByPropertyId: async (propertyId) => {
    try {
      const query = `
        SELECT DISTINCT
          i.amount,
          i.installment_number,
          i.payment_date,
          i.paid_date,
          i.interest,
          cr.total_amount as credit_total,
          cr.interest_number as credit_interest_rate,
          cr.installment_count as total_installments,
          CASE 
            WHEN i.paid_date IS NULL AND i.payment_date < CURRENT_DATE THEN 'vencida'
            WHEN i.paid_date IS NOT NULL THEN 'pagada'
            ELSE 'pendiente'
          END as status
        FROM installment i
        JOIN credit cr ON i.credit_id = cr.credit_id
        JOIN notification_customer_property ncp ON cr.credit_id = ncp.credit_id
        JOIN property p ON ncp.property_id = p.property_id
        LEFT JOIN customer c ON ncp.customer_id = c.customer_id
        WHERE p.property_id = $1
        ORDER BY i.installment_number ASC, i.payment_date ASC;
      `;
      
      const client = await pool.connect();
      try {
        const res = await client.query(query, [propertyId]);
        return res.rows;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error en getByPropertyId:', error);
      throw error;
    }
  },

  // Método adicional para obtener resumen de pagos por propiedad
  getPaymentSummaryByPropertyId: async (propertyId) => {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_installments,
          COUNT(CASE WHEN i.paid_date IS NOT NULL THEN 1 END) as paid_installments,
          COUNT(CASE WHEN i.paid_date IS NULL AND i.payment_date < CURRENT_DATE THEN 1 END) as overdue_installments,
          COUNT(CASE WHEN i.paid_date IS NULL AND i.payment_date >= CURRENT_DATE THEN 1 END) as pending_installments,
          SUM(i.amount) as total_amount,
          SUM(CASE WHEN i.paid_date IS NOT NULL THEN i.amount ELSE 0 END) as paid_amount,
          SUM(CASE WHEN i.paid_date IS NULL THEN i.amount ELSE 0 END) as pending_amount,
          SUM(CASE WHEN i.paid_date IS NULL AND i.payment_date < CURRENT_DATE THEN i.interest ELSE 0 END) as total_interest
        FROM installment i
        JOIN credit cr ON i.credit_id = cr.credit_id
        JOIN notification_customer_property ncp ON cr.credit_id = ncp.credit_id
        WHERE ncp.property_id = $1;
      `;
      
      const client = await pool.connect();
      try {
        const res = await client.query(query, [propertyId]);
        return res.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error en getPaymentSummaryByPropertyId:', error);
      throw error;
    }
  }
};

module.exports = Installment;