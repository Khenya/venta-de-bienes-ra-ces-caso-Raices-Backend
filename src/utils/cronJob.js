const cron = require('node-cron');
const pool = require('../config/db');

async function checkOverdueInstallments() {

  try {
    // 1. Consulta de diagnóstico
    const diagnosticQuery = await pool.query(`
      SELECT DISTINCT
        i.installment_id,
        i.credit_id,
        i.amount,
        i.installment_number,
        i.payment_date,
        i.paid_date,
        i.interest,
        CURRENT_DATE as today,
        (i.payment_date < CURRENT_DATE) as is_overdue
      FROM installment i
      WHERE i.paid_date IS NULL
      ORDER BY i.payment_date ASC
    `);

    // 2. Consulta principal con DISTINCT para evitar duplicados
    const result = await pool.query(`
      SELECT DISTINCT
        i.installment_id,
        i.credit_id,
        i.amount,
        i.installment_number,
        i.payment_date,
        i.paid_date,
        i.interest,
        cr.interest_number as interest_rate,
        ncp.property_id,
        p.manzano,
        p.batch,
        c.customer_id,
        c.name as customer_name
      FROM installment i
      JOIN credit cr ON i.credit_id = cr.credit_id
      JOIN notification_customer_property ncp ON cr.credit_id = ncp.credit_id
      JOIN property p ON ncp.property_id = p.property_id
      JOIN customer c ON ncp.customer_id = c.customer_id
      WHERE i.paid_date IS NULL 
        AND i.payment_date < CURRENT_DATE
      ORDER BY i.payment_date ASC
    `);

    const cuotasVencidas = result.rows;
    console.log("🔍 Cuotas encontradas:", cuotasVencidas);

    if (cuotasVencidas.length === 0) {
      return;
    }

    // 3. Procesar cada cuota vencida (sin duplicados)
    const processedInstallments = new Set();
    
    for (const cuota of cuotasVencidas) {
      try {
        // Evitar procesar la misma cuota múltiples veces
        if (processedInstallments.has(cuota.installment_id)) {
          continue;
        }
        processedInstallments.add(cuota.installment_id);

        // Calcular mora
        const mora = Math.round(cuota.amount * (cuota.interest_rate / 100));

        // Actualizar cuota con mora
        await pool.query(`
          UPDATE installment
          SET interest = $1
          WHERE installment_id = $2
        `, [mora, cuota.installment_id]);

        console.log(`💰 Aplicada mora de $${mora} a cuota ${cuota.installment_number}`);

        // Crear notificación
        const notificationResult = await pool.query(`
          INSERT INTO notification (
            property_id,
            manzano,
            batch,
            type,
            amount,
            due_date,
            created_at,
            state
          ) VALUES (
            $1, $2, $3, $4, $5, $6, NOW(), 'pending'
          )
          RETURNING notification_id;
        `, [
          cuota.property_id,
          cuota.manzano,
          cuota.batch,
          'payment_overdue',
          cuota.amount,
          cuota.payment_date
        ]);

        const notificationId = notificationResult.rows[0].notification_id;

        // Vincular notificación al cliente principal
        await pool.query(`
          INSERT INTO notification_customer_property (
            notification_id,
            customer_id,
            property_id,
            credit_id
          ) VALUES ($1, $2, $3, $4)
        `, [notificationId, cuota.customer_id, cuota.property_id, cuota.credit_id]);

        // Obtener TODOS los usuarios asociados a la propiedad
        const usersResult = await pool.query(`
          SELECT user_id FROM property_users WHERE property_id = $1
        `, [cuota.property_id]);

        const users = usersResult.rows;
        
        // Vincular notificación a cada usuario
        for (const user of users) {
          await pool.query(`
            INSERT INTO user_notifications (
              user_id,
              notification_id,
              seen
            ) VALUES ($1, $2, false)
          `, [user.user_id, notificationId]);
        }

      } catch (error) {
        console.error(`⚠️ Error procesando cuota ${cuota.installment_id}:`, error.message);
      }
    }


  } catch (err) {
    console.error("❌ Error crítico en cron job:", err.message);
    if (err.query) {
      console.error("Consulta fallida:", err.query);
    }
    console.error("Stack trace:", err.stack);
  }
}

cron.schedule('0 0 * * *', checkOverdueInstallments, {
  timezone: "America/La_Paz"
});

module.exports = { checkOverdueInstallments };