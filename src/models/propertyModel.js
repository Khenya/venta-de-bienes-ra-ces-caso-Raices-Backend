const pool = require('../config/db');

const getAllProperties = async () => {
  try {
    const query = 'SELECT * FROM property';
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    throw new Error('Error al obtener las propiedades'); 
  }
};

const getPropertiesByUser = async (userId) => {
  const query = `
    SELECT p.* FROM property p
    INNER JOIN property_users pu ON p.property_id = pu.property_id
    WHERE pu.user_id = $1
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

const getPropertyById = async (propertyId) => {
  const query = 'SELECT * FROM property WHERE property_id = $1';
  const { rows } = await pool.query(query, [propertyId]);
  return rows[0];
};

const getPropertyByPrice = async (price) => {
    try {
      if (!price || isNaN(price)) {
        throw new Error('El precio debe ser un número válido');
      }
  
      const query = 'SELECT * FROM property WHERE price <= $1';
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
  
      const query = 'SELECT * FROM property WHERE LOWER(state) = LOWER($1)';
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
  
      const query = 'SELECT * FROM property WHERE manzano = $1';
      const { rows } = await pool.query(query, [manzano]);
  
      return rows;
    } catch (error) {
      console.error('Error al obtener propiedades por manzano:', error.message);
      throw new Error('No se pudieron obtener las propiedades');
    }
};    

const getPropertyByBatch = async (batch) => {
  try {
    const query = 'SELECT * FROM property WHERE batch = $1';
    const { rows } = await pool.query(query, [batch]);

    return rows;
  } catch (error) {
    console.error('Error al obtener propiedades por lote:', error.message);
    throw new Error('No se pudieron obtener las propiedades');
  }
};

const create = async (propertyData) => {
  const query = `
    INSERT INTO property (manzano, batch, state, meters, price, folio_number, numero_inmueble, testimony_numbre, location, property_number) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;
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

module.exports = {
  getAllProperties,
  getPropertiesByUser,
  getPropertyById,
  getPropertyByState,
  getPropertyByPrice,
  getPropertyByManzano, 
  getPropertyByBatch,
  create,
  update
};
