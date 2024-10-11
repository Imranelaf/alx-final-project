import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
  // Check if the token is sent in the Authorization header
  let token = req.header('Authorization')?.replace('Bearer ', '');

  // If not, check if the token is stored in a cookie
  if (!token) {
    token = req.cookies?.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach the user info to `req.user`
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token or session expired. Please log in again.' });
  }
};

export default authenticateJWT;
