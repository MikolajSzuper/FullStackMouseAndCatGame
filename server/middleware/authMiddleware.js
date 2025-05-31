const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Brak tokena autoryzacyjnego' })
  }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Nieprawidłowy token' })
  }
}

module.exports = authMiddleware