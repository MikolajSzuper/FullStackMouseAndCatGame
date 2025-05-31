const Room = require('../models/room')
const User = require('../models/user')

let rooms = []

function roomToJson(room) {
  return {
    id: room.id,
    name: room.name,
    players: room.players,
    game: room.game,
    rematchVotes: room.rematchVotes,
    lastWinner: room.lastWinner
  }
}

exports.getAllRooms = (req, res) => {
  res.json(rooms.map(roomToJson))
}

exports.getRoom = (req, res) => {
  const room = rooms.find(r => r.id === req.params.id)
  if (!room) return res.status(404).json({ error: 'Pokój nie istnieje' })
  res.json(roomToJson(room))
}

exports.createRoom = (req, res) => {
  const { name, username } = req.body
  const id = 'room' + (rooms.length + 1)
  const newRoom = new Room({ id, name, players: [username || 'user' + (rooms.length + 1)] })
  rooms.push(newRoom)
  res.status(201).json(roomToJson(newRoom))
}

exports.joinRoom = (req, res) => {
  const { username } = req.body
  const room = rooms.find(r => r.id === req.params.id)
  if (!room) return res.status(404).json({ error: 'Pokój nie istnieje' })
  if (room.players.length >= 2) return res.status(400).json({ error: 'Pokój pełny' })
  if (!room.players.includes(username)) room.players.push(username)
  res.json(roomToJson(room))
}

exports.leaveRoom = (req, res) => {
  const { username } = req.body
  const room = rooms.find(r => r.id === req.params.id)
  if (!room) return res.status(404).json({ error: 'Pokój nie istnieje' })
  room.players = room.players.filter(u => u !== username)
  if (room.players.length === 0) {
    rooms = rooms.filter(r => r.id !== req.params.id)
    return res.json({ message: 'Pokój usunięty' })
  }
  if (room.players.length < 2) {
    room.game = null
    room.rematchVotes = []
  }
  res.json({ message: 'Gracz opuścił pokój' })
}

exports.getGame = (req, res) => {
  const room = rooms.find(r => r.id === req.params.id)
  if (!room) return res.status(404).json({ error: 'Pokój nie istnieje' })
  res.json(room.game || null)
}

exports.setGame = (req, res) => {
  const room = rooms.find(r => r.id === req.params.id)
  if (!room) return res.status(404).json({ error: 'Pokój nie istnieje' })
  room.game = req.body
  res.json(room.game)
}

exports.setResult = async (req, res) => {
  const room = rooms.find(r => r.id === req.params.id)
  if (!room) return res.status(404).json({ error: 'Pokój nie istnieje' })
  room.lastWinner = req.body.winner

  if (Array.isArray(room.players) && room.players.length === 2) {
    const [mouse, cat] = room.players
    try {
      if (req.body.winner === 'mouse') {
        // Mysz wygrała
        await User.updateOne({ username: mouse }, { $inc: { 'stats.games': 1, 'stats.wins': 1 } })
        await User.updateOne({ username: cat }, { $inc: { 'stats.games': 1, 'stats.losses': 1 } })
      } else if (req.body.winner === 'cat') {
        // Kot wygrał
        await User.updateOne({ username: cat }, { $inc: { 'stats.games': 1, 'stats.wins': 1 } })
        await User.updateOne({ username: mouse }, { $inc: { 'stats.games': 1, 'stats.losses': 1 } })
      }
    } catch (err) {
      console.error('Błąd przy zapisie wyniku:', err)
    }
  }

  res.json({ ok: true })
}

exports.rematch = (req, res) => {
  const room = rooms.find(r => r.id === req.params.id)
  if (!room) return res.status(404).json({ error: 'Pokój nie istnieje' })
  if (req.body.reset) {
    room.rematchVotes = []
    return res.json({ ok: true })
  }
  if (!room.rematchVotes.includes(req.body.username)) {
    room.rematchVotes.push(req.body.username)
  }
  res.json({ votes: room.rematchVotes })
}

exports._rooms = rooms