module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: 'Unauthorized: No user logged in',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: 'Forbidden: Insufficient permissions',
      });
    }
    next();
  };
};
