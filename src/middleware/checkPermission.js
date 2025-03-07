const Users = require('../models/users.model'); // Importa el modelo de usuarios
const Roles = require('../models/roles.model'); // Importa el modelo de roles
const Permissions = require('../models/permissions.model'); // Importa el modelo de permisos

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    const userId = req.user.userId; // Obtén el ID del usuario desde el token

    try {
      // Obtener los permisos del usuario desde la base de datos
      const userPermissions = await Permissions.sequelize.query(`
        SELECT p.name
        FROM permissions p
        JOIN roles_permissions rp ON p.id = rp.permission_id
        JOIN users_roles ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = :userId
      `, {
        replacements: { userId },
        type: Permissions.sequelize.QueryTypes.SELECT,
      });

      const permissions = userPermissions.map((row) => row.name);

      // Verificar si el usuario tiene el permiso requerido
      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({ error: 'No tienes permiso para realizar esta acción.' });
      }

      next(); // Continuar si el usuario tiene el permiso
    } catch (err) {
      res.status(500).json({ error: 'Error al verificar permisos.' });
    }
  };
};

module.exports = checkPermission;