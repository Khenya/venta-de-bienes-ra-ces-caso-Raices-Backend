const pool = require('../config/db');
const Notification = require('../models/notification.model');
const NotificationCustomerProperty = require('../models/notification_customer_property.model');

const getAllProperties = async () => {
  try {
    const query = `
     SELECT
        p.*,
        STRING_AGG(o.name, ', ') AS owner_names,
        STRING_AGG(o.CI::text, ', ') AS owner_cis
    FROM
        property p
    JOIN
        owner_property op ON p.property_id = op.property_id
    JOIN
        owner o ON op.owner_id = o.CI
    GROUP BY
        p.property_id
    ORDER BY
        p.property_id ASC;
    `;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    throw new Error('Error al obtener las propiedades'); 
  }
};

const getPropertiesByOwner = async (ownerName) => {
  const ownersList = [
    'Aydee Choque',
    'German Choque',
    'Nancy Choque',
    'Jose Choque',
    'Javier Choque'
  ];

  let query = `
    SELECT 
      p.*, 
      STRING_AGG(o.name, ', ') AS owner_names,
      STRING_AGG(o.ci::text, ', ') AS owner_cis
    FROM property p
    INNER JOIN owner_property op ON p.property_id = op.property_id
    INNER JOIN owner o ON op.owner_id = o.ci
  `;

  let values;
  if (ownerName.toUpperCase() === 'TODOS') {
    query += `
      WHERE UPPER(o.name) = ANY ($1::text[])
      GROUP BY p.property_id
    `;
    values = [ownersList];
  } else {
    query += `
      WHERE UPPER(o.name) = $1
      GROUP BY p.property_id
    `;
    values = [ownerName.toUpperCase()];
  }

  const { rows } = await pool.query(query, values);
  return rows;
};

const getPropertyById = async (propertyId) => {
  const query = `
    SELECT
        p.*,
        STRING_AGG(DISTINCT o.name, ', ') AS owner_names,
        STRING_AGG(DISTINCT o.ci::text, ', ') AS owner_cis,
        STRING_AGG(DISTINCT c.name::text, ' | ') AS customer_name,
        STRING_AGG(DISTINCT c.phone::text, ' | ') AS customer_phone,
        STRING_AGG(DISTINCT c.ci::text, ' | ') AS customer_ci
    FROM property p
            INNER JOIN owner_property op ON p.property_id = op.property_id
            INNER JOIN owner o ON op.owner_id = o.ci
            LEFT JOIN notification_customer_property cnp ON p.property_id = cnp.property_id
            LEFT JOIN customer c ON cnp.customer_id = c.customer_id
    WHERE p.property_id = $1
    GROUP BY p.property_id;
    `;
  const { rows } = await pool.query(query, [propertyId]);
  return rows[0];
};

const getPropertyByPrice = async (price) => {
  try {
    if (!price || isNaN(price)) {
      throw new Error('El precio debe ser un número válido');
    }

    const query = `
      SELECT 
        p.*, 
        STRING_AGG(o.name, ', ') AS owner_names,
        STRING_AGG(o.ci::text, ', ') AS owner_cis
      FROM property p
      INNER JOIN owner_property op ON p.property_id = op.property_id
      INNER JOIN owner o ON op.owner_id = o.ci
      WHERE p.price <= $1
      GROUP BY p.property_id
      ORDER BY
        p.property_id ASC;
    `;
    const { rows } = await pool.query(query, [price]);
    return rows;
  } catch (error) {
    console.error('Error al obtener propiedades por precio:', error.message);
    throw new Error('No se pudieron obtener las propiedades');
  }
};
  
const getPropertyByState = async (state) => {
  try {
    if (!state) {
      throw new Error('El estado es requerido');
    }

    const query = `
      SELECT 
        p.*, 
        STRING_AGG(o.name, ', ') AS owner_names,
        STRING_AGG(o.ci::text, ', ') AS owner_cis
      FROM property p
      INNER JOIN owner_property op ON p.property_id = op.property_id
      INNER JOIN owner o ON op.owner_id = o.ci
      WHERE LOWER(p.state) = LOWER($1)
      GROUP BY p.property_id
    `;
    const { rows } = await pool.query(query, [state]);
    return rows;
  } catch (error) {
    console.error('Error al obtener propiedades por estado:', error.message);
    throw new Error('No se pudieron obtener las propiedades');
  }
};

const getPropertyByManzano = async (manzano) => {
  try {
    if (!manzano || isNaN(manzano)) {
      throw new Error('El manzano debe ser un número válido');
    }

    const query = `
      SELECT 
        p.*, 
        STRING_AGG(o.name, ', ') AS owner_names,
        STRING_AGG(o.ci::text, ', ') AS owner_cis
      FROM property p
      INNER JOIN owner_property op ON p.property_id = op.property_id
      INNER JOIN owner o ON op.owner_id = o.ci
      WHERE p.manzano = $1
      GROUP BY p.property_id
    `;
    const { rows } = await pool.query(query, [manzano]);
    return rows;
  } catch (error) {
    console.error('Error al obtener propiedades por manzano:', error.message);
    throw new Error('No se pudieron obtener las propiedades');
  }
};   

const getPropertyByBatch = async (batch) => {
  try {
    const query = `
      SELECT 
        p.*, 
        STRING_AGG(o.name, ', ') AS owner_names,
        STRING_AGG(o.ci::text, ', ') AS owner_cis
      FROM property p
      INNER JOIN owner_property op ON p.property_id = op.property_id
      INNER JOIN owner o ON op.owner_id = o.ci
      WHERE p.batch = $1
      GROUP BY p.property_id
    `;
    const { rows } = await pool.query(query, [batch]);
    return rows;
  } catch (error) {
    console.error('Error al obtener propiedades por lote:', error.message);
    throw new Error('No se pudieron obtener las propiedades');
  }
};

const create = async (propertyData) => {
  const query = `
    INSERT INTO property (manzano, batch, state, meters, price, folio_number, testimony_numbre, location, property_number)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
  `;
  const values = Object.values(propertyData);
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const update = async (id, propertyData) => {
  const fields = Object.keys(propertyData).map((key, i) => `${key} = $${i + 1}`).join(', ');
  const values = [...Object.values(propertyData), id];

  const query = `UPDATE property SET ${fields} WHERE property_id = $${values.length} RETURNING *;`;
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const createObservation = async(observacionData) => {
  const query = `
    INSERT INTO observation (property_id, observacion, date)
    VALUES ($1, $2, $3) RETURNING*;
  `;
  const values = Object.values(observacionData);
  const { rows } = await pool.query(query, values);
  return rows[0];
}

const getObservationsByProperty = async (propertyId) => {
  const query = `
    SELECT 
      observacion as note, 
      TO_CHAR(date, 'YYYY-MM-DD') as date 
    FROM observation 
    WHERE property_id = $1
    ORDER BY date DESC`;
  
  const { rows } = await pool.query(query, [propertyId]);
  return rows;
};

const getPropertiesByUser = async (userId) => {
  const query = `
    SELECT
      p.*,
      STRING_AGG(o.name, ', ') AS owner_names
    FROM property p
    JOIN owner_property op ON p.property_id = op.property_id
    JOIN owner o ON op.owner_id = o.ci
    JOIN users u ON o.name = u.username
    WHERE u.user_id = $1
    GROUP BY p.property_id;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

const updatePropertyState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;

    const allowedStates = ["LIBRE", "RESERVADO", "RETRASADO", "CANCELADO", "PAGADO", "CADUCADO"];
    if (!allowedStates.includes(state.toUpperCase())) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const property = await getPropertyById(id);
    if (!property) {
      return res.status(404).json({ message: "Propiedad no encontrada" });
    }

    const updated = await update(id, { state: state.toUpperCase() });

    const notification = await Notification.create({
      property_id: property.property_id,
      manzano: property.manzano,
      batch: property.batch,
      state: state.toUpperCase()
    });

    await NotificationCustomerProperty.linkPropertyToNotification(
      property.property_id,
      notification.notification_id
    );

    res.status(200).json({
      message: "Propiedad actualizada y notificación generada",
      property: updated,
      notification
    });
  } catch (error) {
    console.error("Error al actualizar estado o crear notificación:", error.message);
    res.status(500).json({ message: "No se pudo actualizar la propiedad" });
  }
};

module.exports = {
  getAllProperties,
  getPropertiesByOwner,
  getPropertyById,
  getPropertyByState,
  getPropertyByPrice,
  getPropertyByManzano, 
  getPropertyByBatch,
  create,
  update, 
  createObservation,
  getObservationsByProperty,
  getPropertiesByUser,
  updatePropertyState
};