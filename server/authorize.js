const jwt = require("jsonwebtoken")

const authorizeJWT = async (req, res, next) => {
  const token = await req.cookies.token

  if (!token) {
    return res.status(401).json({ message: "Access denied." })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // attach user info to request
    next()
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." })
  }
}
module.exports = authorizeJWT
