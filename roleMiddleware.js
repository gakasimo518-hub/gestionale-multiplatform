const jwt = require('jsonwebtoken');

/**
 * Role-based access control middleware.
 *
 * @param {string|string[]} requiredRoles - Role or array of roles that are allowed to access the route.
 * @returns {function} Express middleware function.
 */
function roleMiddleware(requiredRoles) {
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  return (req, res, next) => {
    // Retrieve the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Expected format: "Bearer <token>"
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Authorization header malformed' });
    }

    const token = tokenParts[1];
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    // Verify the JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }

      // Attach decoded payload to request for downstream handlers
      req.user = decoded;

      // Check if the user's role is allowed
      const userRole = decoded.role;
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden: insufficient role' });
      }

      // All checks passed, proceed to the next middleware/route handler
      next();
    });
  };
}

module.exports = roleMiddleware;