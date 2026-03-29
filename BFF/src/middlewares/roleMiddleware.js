// src/middlewares/roleMiddleware.js
const authenticate = require('./authMiddleware');

const requireRole = (requiredRole) => {
  return (req, res, next) => {
    authenticate(req, res, (err) => {  
      if (err || !req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden: Insufficient role' });
      }
      
      next(); 
    });
  };
};

module.exports = requireRole;