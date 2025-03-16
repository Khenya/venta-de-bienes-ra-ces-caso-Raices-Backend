const { 
    getAllProperties,
    getPropertiesByUser,
    getPropertyById,
    getPropertyByState,
    getPropertyByPrice,
    getPropertyByManzano, 
    getPropertyByBatch
} = require('../models/propertyModel');

const getAllPropertiesHandler = async (req, res) => {
  try {
    if (req.user.role !== 'Administrador') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    const properties = await getAllProperties();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los inmuebles' });
  }
};

const getPropertiesByUserHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const properties = await getPropertiesByUser(userId);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los inmuebles' });
  }
};

const getPropertyByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await getPropertyById(id);

    if (!property) {
      return res.status(404).json({ message: 'Inmueble no encontrado' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el inmueble' });
  }
};

const getPropertyByStateHandler = async (req, res) => {
    try {
      const { state } = req.params;
      const properties = await getPropertyByState(state);
  
      if (properties.length === 0) {
        return res.status(404).json({ message: 'No se encontraron propiedades con ese estado' });
      }
  
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const getPropertyByPriceHandler = async (req, res) => {
    try {
      const { price } = req.params;
  
      const properties = await getPropertyByPrice(price);
  
      if (properties.length === 0) {
        return res.status(404).json({ message: 'No se encontraron propiedades dentro de este rango de precio' });
      }
  
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const getPropertyByManzanoHandler = async (req, res) => {
    try {
      const { manzano } = req.params;
  
      const properties = await getPropertyByManzano(manzano);
  
      if (properties.length === 0) {
        return res.status(404).json({ message: 'No se encontraron propiedades en ese manzano' });
      }
  
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const getPropertyByBatchHandler = async (req, res) => {
    try {
      const { batch } = req.params;
  
      const properties = await getPropertyByBatch(batch);
  
      if (properties.length === 0) {
        return res.status(404).json({ message: 'No se encontraron propiedades en ese lote' });
      }
  
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllPropertiesHandler,
    getPropertiesByUserHandler,
    getPropertyByIdHandler,
    getPropertyByStateHandler,
    getPropertyByPriceHandler,
    getPropertyByManzanoHandler, 
    getPropertyByBatchHandler
};
