const { 
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
    getObservationsByProperty
    
} = require('../models/propertyModel');
const Owner = require('../models/owner.model');
const Notification = require('../models/notification.model');
const NotificationCustomerProperty = require('../models/notification_customer_property.model');
const pool = require('../config/db');

const getAllPropertiesHandler = async (req, res) => {
  try {
    const owner = req.query.owner;

    if (owner) {
      const filtered = await getPropertiesByOwner(owner);
      return res.status(200).json(filtered);
    }
    const properties = await getAllProperties();

    if (!properties || properties.length === 0) {
      return res.status(404).json({ message: 'No hay propiedades disponibles' });
    }

    res.json(properties);
  } catch (error) {
    console.error('Error al obtener propiedades:', error.message);
    res.status(500).json({ message: 'No se pudieron obtener las propiedades' });
  }
};

const getPropertiesByOwnerNameHandler = async (req, res) => {
  try {
    const { owner } = req.query;

    if (!owner) {
      return res.status(400).json({ message: "Se requiere el nombre del propietario" });
    }

    const result = await getPropertiesByOwner(owner);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No se encontraron propiedades para ese propietario" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener propiedades por dueño:", error.message);
    res.status(500).json({ message: "Error al obtener propiedades" });
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
    const {
      manzano,
      batch,
      state,
      meters,
      price,
      folio_number,
      testimony_numbre,
      location,
      property_number,
      owner_name
    } = req.body;

    if (!manzano || !batch || !state || !location || !owner_name) {
      return res.status(400).json({
        message: "Campos obligatorios: manzano, batch, state, location, owner_name"
      });
    }
    const owner = await Owner.findByName(owner_name);
    if (!owner) {
      return res.status(404).json({ message: "El propietario no existe" });
    }

    let property;
    if (id) {
      property = await update(id, {
        manzano, batch, state, meters, price,
        folio_number, testimony_numbre, location, property_number
      });
    } else {
      property = await create({
        manzano, batch, state, meters, price,
        folio_number, testimony_numbre, location, property_number
      });

      await Owner.linkToProperty(owner.ci, property.property_id);

    }

    res.status(200).json({
      message: id ? "Propiedad actualizada" : "Propiedad creada y asociada al propietario",
      property
    });
  } catch (error) {
    console.error("Error al guardar propiedad:", error.message);
    res.status(500).json({ message: "No se pudo guardar la propiedad" });
  }
};;

const updatePropertyState = async (req, res) => {
  try {
    const { id } = req.params;
    let { state, price } = req.body;

    const allowedStates = ["LIBRE", "RESERVADO", "RETRASADO", "CANCELADO", "PAGADO", "CADUCADO"];
    if (state && !allowedStates.includes(state.toUpperCase())) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const updates = {};
    if (state) updates.state = state.toUpperCase();
    if (price !== undefined && price !== null) updates.price = price;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Nada para actualizar" });
    }

    const property = await getPropertyById(id);
    if (!property) {
      return res.status(404).json({ message: "Propiedad no encontrada" });
    }

    const updated = await update(id, updates);

    const notification = await Notification.create({
      property_id: property.property_id,
      manzano: property.manzano,
      batch: property.batch,
      state: updates.state
    });

    const ownersQuery = `
      SELECT u.user_id, u.username
      FROM owner_property op
      JOIN owner o ON op.owner_id = o.ci
      JOIN users u ON TRIM(LOWER(o.name)) = TRIM(LOWER(u.username))
      WHERE op.property_id = $1;
    `;
    const { rows: owners } = await pool.query(ownersQuery, [property.property_id]);
    
    for (const owner of owners) {
      try {
        await pool.query(
          `INSERT INTO user_notifications (user_id, notification_id) VALUES ($1, $2)`,
          [owner.user_id, notification.notification_id]
        );
      } catch (err) {
        console.error(`Error al insertar notificación para user_id=${owner.user_id}:`, err.message);
      }
    }

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

const createObservationHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const { property_id, observacion } = req.body;
    
    if (!property_id || !observacion) {
      return res.status(400).json({ 
        message: 'Se requieren property_id y observacion' 
      });
    }

    const observacionData = {
      property_id,
      observacion,
      date: new Date() 
    };

    const newObservation = await createObservation(observacionData);
    res.status(201).json({
      message: 'Observación creada exitosamente',
      observation: newObservation
    });

  } catch (error) {
    console.error('Error al crear observación:', error.message);
    res.status(500).json({ 
      message: 'Error al crear observación',
      error: error.message 
    });
  }
};

const getObservationsByPropertyId = async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    if (isNaN(propertyId)) {
      return res.status(400).json({ message: 'ID de propiedad inválido' });
    }

    const observations = await getObservationsByProperty(propertyId);
    res.json(observations);
  } catch (error) {
    console.error('Error al obtener observaciones:', error);
    res.status(500).json({ message: 'Error al obtener observaciones' });
  }
};

module.exports = {
    getAllPropertiesHandler,
    getPropertiesByOwnerNameHandler,
    getPropertyByIdHandler,
    getPropertyByStateHandler,
    getPropertyByPriceHandler,
    getPropertyByManzanoHandler, 
    getPropertyByBatchHandler, 
    createOrUpdateProperty,
    updatePropertyState, 
    createObservationHandler,
    getObservationsByPropertyId
};
