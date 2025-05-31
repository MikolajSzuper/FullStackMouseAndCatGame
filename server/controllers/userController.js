const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { JWT_SECRET } = require('../config')

const users = []

exports.register = async (req, res) => {
  const { username, password } = req.body
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Użytkownik już istnieje' })
  }
  const hashed = await bcrypt.hash(password, 10)
  users.push(new User({ username, password: hashed }))
  res.status(201).json({ message: 'Utworzono konto' })
}

exports.login = async (req, res) => {
  const { username, password } = req.body
  const user = users.find(u => u.username === username)
  if (!user) return res.status(401).json({ error: 'Błędne dane' })
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'Błędne dane' })
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' })
  res.json({ token })
}

exports.me = (req, res) => {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'Brak tokena' })
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET)
    res.json({ username: decoded.username })
  } catch {
    res.status(401).json({ error: 'Nieprawidłowy token' })
  }
}

exports.saveResult = (req, res) => {
  // Tu możesz zapisać wynik do bazy lub pliku
  // Przykład: console.log(req.body)
  res.json({ ok: true })
}