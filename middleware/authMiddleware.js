const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Header check karo
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: "Access Denied. No token provided." });

  try {
    // Bearer <token> se sirf token nikaalo
    const token = authHeader.split(" ")[1];
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // IMPORTANT: Payload se 'id' nikaal kar req.user mein daalo
    req.user = { id: verified.id }; 
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid or Expired Token" });
  }
};