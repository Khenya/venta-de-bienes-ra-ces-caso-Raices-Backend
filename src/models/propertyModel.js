const pool = require('../config/db');

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
       ORDER BY
        p.property_id ASC;
    `;
    values = [ownersList];
  } else {
    query += `
      WHERE UPPER(o.name) = $1
      GROUP BY p.property_id
       ORDER BY
        p.property_id ASC;
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

const createObservation = async (observacionData) => {
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

const getPropertyCountByState = async () => {
  const query = `
    SELECT state, COUNT(*) AS count
    FROM property
    GROUP BY state;
  `;
  const { rows } = await pool.query(query);
  return rows;
};

const getPropertyCounts = async () => {
  const query = `
    SELECT
      COUNT(*) FILTER (WHERE state = 'LIBRE') AS libres,
      COUNT(*) FILTER (WHERE state = 'LIQUIDANDO') AS liquidando,
      COUNT(*) FILTER (WHERE state = 'CANCELADO') AS cancelado,
      COUNT(*) AS total
    FROM property;
  `;
  const { rows } = await pool.query(query);
  return rows[0];
};

const getPropertyCountByOwner = async () => {
  const query = `
    SELECT
      o.name AS owner,
      COUNT(op.property_id) AS count
    FROM owner o
    JOIN owner_property op ON o.ci = op.owner_id
    GROUP BY o.name
    ORDER BY count DESC;
  `;
  const { rows } = await pool.query(query);
  return rows;
};

const getFilteredProperties = async ({ owner, state, price, manzano, batch }) => {
  let query = `
    SELECT 
      p.*, 
      STRING_AGG(o.name, ', ') AS owner_names,
      STRING_AGG(o.ci::text, ', ') AS owner_cis
    FROM property p
    INNER JOIN owner_property op ON p.property_id = op.property_id
    INNER JOIN owner o ON op.owner_id = o.ci
    WHERE 1=1
  `;
  const values = [];
  let i = 1;

  if (owner) {
    query += ` AND UPPER(o.name) = UPPER($${i++})`;
    values.push(owner);
  }
  if (state) {
    query += ` AND LOWER(p.state) = LOWER($${i++})`;
    values.push(state);
  }
  if (price) {
    query += ` AND p.price <= $${i++}`;
    values.push(price);
  }
  if (manzano) {
    query += ` AND p.manzano = $${i++}`;
    values.push(manzano);
  }
  if (batch) {
    query += ` AND p.batch = $${i++}`;
    values.push(batch);
  }

  query += ` GROUP BY p.property_id ORDER BY p.property_id ASC`;

  const { rows } = await pool.query(query, values);

  return rows;
};

module.exports = {
  getAllProperties,
  getPropertiesByOwner,
  getPropertyById,
  create,
  update,
  createObservation,
  getObservationsByProperty,
  getPropertiesByUser,
  getPropertyCountByState,
  getPropertyCounts,
  getPropertyCountByOwner,
  getFilteredProperties
};