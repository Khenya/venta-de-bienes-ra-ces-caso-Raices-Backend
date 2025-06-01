const pool = require('../config/db');

const Credit = {
  create: async ({ totalAmount, interestNumber, installmentsCount }) => {
    const res = await pool.query(
      `INSERT INTO credit (total_amount, interest_number, installment_count)
       VALUES ($1, $2, $3) RETURNING *`,
      [totalAmount, interestNumber, installmentsCount]
    );
    return res.rows[0];
  },
  getById: async (id) => {
    const res = await pool.query(`SELECT * FROM credit WHERE credit_id = $1`, [id]);
    return res.rows[0];
  },
};

module.exports = Credit;