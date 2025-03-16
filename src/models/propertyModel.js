const pool = require('../config/db');

const getAllProperties = async () => {
  const query = 'SELECT * FROM property';
  const { rows } = await pool.query(query);
  return rows;
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
      if (!batch || isNaN(batch)) {
        throw new Error('El lote debe ser un número válido');
      }
  
      const query = 'SELECT * FROM property WHERE lote = $1';
      const { rows } = await pool.query(query, [batch]);
  
      return rows;
    } catch (error) {
      console.error('Error al obtener propiedades por lote:', error.message);
      throw new Error('No se pudieron obtener las propiedades');
    }
};    

module.exports = {
  getAllProperties,
  getPropertiesByUser,
  getPropertyById,
  getPropertyByState,
  getPropertyByPrice,
  getPropertyByManzano, 
  getPropertyByBatch
};
