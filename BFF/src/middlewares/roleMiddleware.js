// src/middlewares/roleMiddleware.js
const authenticate = require('./authMiddleware');

const normalizeRole = (value) => String(value || "").trim().toUpperCase();

const resolveUserRole = (user) => {
  if (!user) return "";

  if (user.role) {
    return normalizeRole(user.role);
  }

  if (user["custom:role"]) {
    return normalizeRole(user["custom:role"]);
  }

  const groups = user["cognito:groups"];
  if (Array.isArray(groups) && groups.length > 0) {
    return normalizeRole(groups[0]);
  }

  return "";
};

const requireRole = (requiredRole) => {
  return (req, res, next) => {
    authenticate(req, res, (err) => {  
      if (err || !req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const role = resolveUserRole(req.user);
      if (role !== normalizeRole(requiredRole)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient role' });
      }
      
      next(); 
    });
  };
};

module.exports = requireRole;