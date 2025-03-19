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
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const properties = await getAllProperties(); 

    if (!properties || properties.length === 0) {
      return res.status(404).json({ message: 'No hay propiedades disponibles' });
    }

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'No se pudieron obtener las propiedades' });
  }
};  

const getPropertiesByUserHandler = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) { 
      return res.status(400).json({ message: "No se pudo obtener el ID del usuario" });
    }

    const userId = req.user.userId; 

    const properties = await getPropertiesByUser(userId);

    if (properties.length === 0) {
      return res.status(404).json({ message: "No se encontraron propiedades para este usuario" });
    }

    res.json(properties);
  } catch (error) {
    console.error("Error al obtener los inmuebles:", error.message);
    res.status(500).json({ message: "Error al obtener los inmuebles" });
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
      console.error('Error al obtener propiedades por lote:', error.message);
      res.status(500).json({ message: 'No se pudieron obtener las propiedades' });
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
