const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { JWT_SECRET } = require('../config')

exports.register = async (req, res) => {
  const { username, password, email } = req.body
  if (await User.findOne({ username })) {
    return res.status(400).json({ error: 'Użytkownik już istnieje' })
  }
  const hashed = await bcrypt.hash(password, 10)
  const user = new User({ username, password: hashed, email })
  await user.save()
  res.status(201).json({ message: 'Utworzono konto' })
}

exports.login = async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  if (!user) return res.status(401).json({ error: 'Błędne dane' })
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'Błędne dane' })
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' })
  res.json({ token })
}

exports.me = async (req, res) => {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'Brak tokena' })
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET)
    const user = await User.findOne({ username: decoded.username })
    if (!user) return res.status(404).json({ error: 'Nie znaleziono użytkownika' })
    res.json({ username: user.username, email: user.email, stats: user.stats })
  } catch {
    res.status(401).json({ error: 'Nieprawidłowy token' })
  }
}

// Zapisz wynik gry
exports.saveResult = async (req, res) => {
  const { username, result } = req.body
  const user = await User.findOne({ username })
  if (!user) return res.status(404).json({ error: 'Nie znaleziono użytkownika' })
  user.stats.games += 1
  if (result === 'win') user.stats.wins += 1
  if (result === 'lose') user.stats.losses += 1
  await user.save()
  res.json({ ok: true })
}

exports.updateMe = async (req, res) => {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'Brak tokena' })
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET)
    const user = await User.findOne({ username: decoded.username })
    if (!user) return res.status(404).json({ error: 'Nie znaleziono użytkownika' })

    const valid = await bcrypt.compare(req.body.password, user.password)
    if (!valid) return res.status(401).json({ error: 'Błędne hasło' })


    if (req.body.username && req.body.username !== user.username) {
      if (await User.findOne({ username: req.body.username })) {
        return res.status(400).json({ error: 'Nazwa użytkownika zajęta' })
      }
      user.username = req.body.username
    }

    if (req.body.email) user.email = req.body.email

    if (req.body.newPassword) user.password = await bcrypt.hash(req.body.newPassword, 10)
    await user.save()
    res.json({
      username: user.username,
      email: user.email,
      stats: user.stats,
      createdAt: user.createdAt
    })
  } catch {
    res.status(401).json({ error: 'Nieprawidłowy token' })
  }
}

exports.stats = async (req, res) => {
  const users = await User.find()
  const totalUsers = users.length
  const totalGames = users.reduce((sum, u) => sum + (u.stats?.games || 0), 0)
  const avgWins = totalUsers ? users.reduce((sum, u) => sum + (u.stats?.wins || 0), 0) / totalUsers : 0
  const avgLosses = totalUsers ? users.reduce((sum, u) => sum + (u.stats?.losses || 0), 0) / totalUsers : 0
  const topWinners = [...users].sort((a, b) => (b.stats?.wins || 0) - (a.stats?.wins || 0)).slice(0, 10)
  const topLosers = [...users].sort((a, b) => (b.stats?.losses || 0) - (a.stats?.losses || 0)).slice(0, 10)
  const lastRegistered = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)
  res.json({
    totalUsers,
    totalGames,
    avgWins,
    avgLosses,
    topWinners: topWinners.map(u => ({
      username: u.username,
      stats: u.stats
    })),
    topLosers: topLosers.map(u => ({
      username: u.username,
      stats: u.stats
    })),
    lastRegistered: lastRegistered.map(u => ({
      username: u.username,
      createdAt: u.createdAt
    }))
  })
}