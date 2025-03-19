const { 
    getAllProperties,
    getPropertiesByUser,
    getPropertyById,
    getPropertyByState,
    getPropertyByPrice,
    getPropertyByManzano, 
    getPropertyByBatch, 
    create, 
    update
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

const createOrUpdateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { manzano, batch, state, meters, price, folio_number, numero_inmueble, testimony_numbre, location, property_number } = req.body;

    if (!manzano || !batch || !state || !meters) {
      return res.status(400).json({ message: "Campos obligatorios: manzano, batch, state, meters" });
    }

    let property;
    if (id) {
      property = await update(id, { manzano, batch, state, meters, price, folio_number, numero_inmueble, testimony_numbre, location, property_number });
    } else {
      property = await create({ manzano, batch, state, meters, price, folio_number, numero_inmueble, testimony_numbre, location, property_number });
    }

    res.status(200).json({ message: id ? "Propiedad actualizada" : "Propiedad creada", property });
  } catch (error) {
    console.error("Error al guardar propiedad:", error.message);
    res.status(500).json({ message: "No se pudo guardar la propiedad" });
  }
};

const updatePropertyState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;

    const allowedStates = ["libre", "reservado", "retrasado", "cancelado", "pagado", "caducado"];
    if (!allowedStates.includes(state)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const property = await Property.update(id, { state });
    if (!property) {
      return res.status(404).json({ message: "Propiedad no encontrada" });
    }

    res.status(200).json({ message: "Estado actualizado", property });
  } catch (error) {
    console.error("Error al actualizar estado:", error.message);
    res.status(500).json({ message: "No se pudo actualizar el estado" });
  }
};

module.exports = {
    getAllPropertiesHandler,
    getPropertiesByUserHandler,
    getPropertyByIdHandler,
    getPropertyByStateHandler,
    getPropertyByPriceHandler,
    getPropertyByManzanoHandler, 
    getPropertyByBatchHandler, 
    createOrUpdateProperty,
    updatePropertyState
};
