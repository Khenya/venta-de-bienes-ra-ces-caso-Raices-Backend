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
    'Aydee Mercedes Choque de Alvarado',
    'German Choque Ramos',
    'Nancy Lidia Choque Ramos',
    'Jose Luis Choque Ramos',
    'Javier Yason Choque Ramos'
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
        STRING_AGG(DISTINCT obs.observacion, ' | ') AS observations,
        STRING_AGG(DISTINCT obs.date::text, ' | ') AS observation_dates,
        STRING_AGG(DISTINCT c.name::text, ' | ') AS customer_name,
        STRING_AGG(DISTINCT c.phone::text, ' | ') AS customer_phone,
        STRING_AGG(DISTINCT c.ci::text, ' | ') AS customer_ci
    FROM property p
            INNER JOIN owner_property op ON p.property_id = op.property_id
            INNER JOIN owner o ON op.owner_id = o.ci
            LEFT JOIN observation obs ON p.property_id = obs.property_id
            LEFT JOIN notification_customer_property cnp ON p.property_id = cnp.id_inmueble
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
  createObservation
};
