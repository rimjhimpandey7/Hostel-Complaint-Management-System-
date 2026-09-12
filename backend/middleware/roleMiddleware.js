const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user ? req.user.role : 'Guest'}' does not have permission to access this endpoint.`,
      });
    }
    next();
  };
};

module.exports = { authorize };
