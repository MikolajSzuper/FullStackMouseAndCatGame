// const express = require('express')
// const app = express()
// //const gameRoutes = require('./routes/gameRoutes')

// app.use(express.json())
// //app.use('/api/game', gameRoutes)
// // ...serwowanie klienta...

// app.listen(3000)
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()
app.use(cors())
app.use(express.json())

const JWT_SECRET = 'tajny_klucz'
const users = [] // Przechowuje użytkowników w pamięci

let rooms = [
  { id: 'room1', name: 'Pokój 1', players: ['user1'] },
  { id: 'room2', name: 'Pokój 2', players: ['user2', 'user3'] }
]

app.get('/api/rooms', (req, res) => {
  res.json(rooms)
})

app.get('/api/rooms/:id', (req, res) => {
  const room = rooms.find(r => r.id === req.params.id)
  if (!room) return res.status(404).json({ error: 'Pokój nie istnieje' })
  res.json(room)
})

app.post('/api/rooms/:id/join', (req, res) => {
  const { username } = req.body
  const room = rooms.find(r => r.id === req.params.id)
  if (!room) return res.status(404).json({ error: 'Pokój nie istnieje' })
  if (!room.players) room.players = []
  if (room.players.length >= 2) return res.status(400).json({ error: 'Pokój pełny' })
  if (!room.players.includes(username)) room.players.push(username)
  res.json(room)
})

app.post('/api/rooms/:id/result', (req, res) => {
  const room = rooms.find(r => r.id === req.params.id)
  if (!room) return res.status(404).json({ error: 'Pokój nie istnieje' })
  room.lastWinner = req.body.winner
  res.json({ ok: true })
})

app.post('/api/rooms/:id/rematch', (req, res) => {
  const room = rooms.find(r => r.id === req.params.id)
  if (!room) return res.status(404).json({ error: 'Pokój nie istnieje' })
  if (req.body.reset) {
    room.rematchVotes = []
    return res.json({ ok: true })
  }
  if (!room.rematchVotes) room.rematchVotes = []
  if (!room.rematchVotes.includes(req.body.username)) {
    room.rematchVotes.push(req.body.username)
  }
  res.json({ votes: room.rematchVotes })
})

// Zmień tworzenie pokoju, aby dodać username:
app.post('/api/rooms', (req, res) => {
  const { name, username } = req.body
  const id = 'room' + (rooms.length + 1)
  const newRoom = { id, name, players: [username || 'user' + (rooms.length + 1)] }
  rooms.push(newRoom)
  res.status(201).json(newRoom)
})

app.post('/api/rooms/:id/leave', (req, res) => {
  const { username } = req.body
  const room = rooms.find(r => r.id === req.params.id)
  if (!room) return res.status(404).json({ error: 'Pokój nie istnieje' })
  if (room.players) {
    room.players = room.players.filter(u => u !== username)
  }
  // Jeśli nie ma już graczy, usuń pokój
  if (!room.players || room.players.length === 0) {
    rooms = rooms.filter(r => r.id !== req.params.id)
    return res.json({ message: 'Pokój usunięty' })
  }
  // Jeśli został tylko jeden gracz, zresetuj grę i rematchVotes
  if (room.players.length < 2) {
    room.game = null
    room.rematchVotes = []
  }
  res.json({ message: 'Gracz opuścił pokój' })
})

app.get('/api/rooms/:id/game', (req, res) => {
  const room = rooms.find(r => r.id === req.params.id)
  if (!room) return res.status(404).json({ error: 'Pokój nie istnieje' })
  res.json(room.game || null)
})

app.post('/api/rooms/:id/game', (req, res) => {
  const room = rooms.find(r => r.id === req.params.id)
  if (!room) return res.status(404).json({ error: 'Pokój nie istnieje' })
  room.game = req.body
  res.json(room.game)
})

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Użytkownik już istnieje' })
  }
  const hashed = await bcrypt.hash(password, 10)
  users.push({ username, password: hashed })
  res.status(201).json({ message: 'Utworzono konto' })
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  const user = users.find(u => u.username === username)
  if (!user) return res.status(401).json({ error: 'Błędne dane' })
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'Błędne dane' })
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' })
  res.json({ token })
})

app.get('/api/me', (req, res) => {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'Brak tokena' })
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET)
    res.json({ username: decoded.username })
  } catch {
    res.status(401).json({ error: 'Nieprawidłowy token' })
  }
})

app.listen(5000, () => console.log('Serwer działa na http://localhost:5000'))