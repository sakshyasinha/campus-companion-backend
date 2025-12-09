import jwt from 'jsonwebtoken'

export function requireAuth (req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Missing token' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export function requireRole (...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthenticated' })
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}
