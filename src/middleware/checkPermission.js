const pool = require('../config/db');

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    const userId = req.user.userId;

    try {
      const query = `
        SELECT p.name
        FROM permission p
        JOIN permissions_roles pr ON p.id = pr.permissions_id
        JOIN users u ON pr.rol_id = u.rol_id
        WHERE u.id = $1
      `;

      const { rows } = await pool.query(query, [userId]);

      const permissions = rows.map((row) => row.name);

      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({ error: 'No tienes permiso para realizar esta acción.' });
      }

      next(); 
    } catch (err) {
      console.error('Error al verificar permisos:', err);
      res.status(500).json({ error: 'Error al verificar permisos.' });
    }
  };
};

module.exports = checkPermission;