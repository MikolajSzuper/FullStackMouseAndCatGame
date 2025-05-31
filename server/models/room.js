class Room {
  constructor({ id, name, players }) {
    this.id = id
    this.name = name
    this.players = players || []
    this.game = null
    this.rematchVotes = []
    this.lastWinner = null
  }
}

module.exports = Room