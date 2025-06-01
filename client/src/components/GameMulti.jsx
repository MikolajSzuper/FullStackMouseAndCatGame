import { useEffect, useState } from 'react'
import '../GameCommon.css'

const nodes = [
  { id: 0, x: 200, y: 50 },   // mysz start
  { id: 1, x: 80, y: 180 },
  { id: 2, x: 320, y: 180 },
  { id: 3, x: 80, y: 330 },
  { id: 4, x: 320, y: 330 },
  { id: 5, x: 200, y: 250 },  // kot start
]

const edges = [
  [0, 1], [0, 2], [0, 5],
  [1, 3],
  [2, 4],
  [3, 5], [4, 5], [3, 4]
]

function isNeighbor(a, b) {
  return edges.some(([x, y]) =>
    (x === a && y === b) || (x === b && y === a)
  )
}

export default function GameMulti({ roomId, username, onBack }) {
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [game, setGame] = useState(null)
  const [role, setRole] = useState(null)
  const [left, setLeft] = useState(false)
  const [rematch, setRematch] = useState(false)
  const [opponentRematch, setOpponentRematch] = useState(false)

  // Polling na stan pokoju i gry
  useEffect(() => {
    const token = localStorage.getItem('token')
    const interval = setInterval(() => {
      fetch(`http://localhost:5000/api/rooms/${roomId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setRoom(data)
          setLoading(false)
          if (data.game) setGame(data.game)
          // Ustal role na podstawie kolejności w tablicy players
          if (Array.isArray(data.players)) {
            if (data.players[0] === username) setRole('mouse')
            else if (data.players[1] === username) setRole('cat')
          }
          // Rematch logic
          if (data.rematchVotes) {
            setOpponentRematch(
              Array.isArray(data.rematchVotes) &&
              data.rematchVotes.includes(username)
                ? data.rematchVotes.length === 2
                : data.rematchVotes.length === 1
            )
          } else {
            setOpponentRematch(false)
          }
        })
        .catch(() => {
          setRoom(null)
          setLoading(false)
        })
    }, 1000)
    // pobierz od razu na start
    fetch(`http://localhost:5000/api/rooms/${roomId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setRoom(data)
        setLoading(false)
        if (data.game) setGame(data.game)
        if (Array.isArray(data.players)) {
          if (data.players[0] === username) setRole('mouse')
          else if (data.players[1] === username) setRole('cat')
        }
        if (data.rematchVotes) {
          setOpponentRematch(
            Array.isArray(data.rematchVotes) &&
            data.rematchVotes.includes(username)
              ? data.rematchVotes.length === 2
              : data.rematchVotes.length === 1
          )
        } else {
          setOpponentRematch(false)
        }
      })
      .catch(() => {
        setRoom(null)
        setLoading(false)
      })
    return () => clearInterval(interval)
  }, [roomId, username])

  // Inicjalizacja gry po dołączeniu drugiego gracza lub rematch
  useEffect(() => {
    if (room && room.players && room.players.length === 2) {
      if (!room.game || (room.rematchVotes && room.rematchVotes.length === 2)) {
        // tylko pierwszy gracz inicjuje grę
        if (room.players[0] === username) {
          const token = localStorage.getItem('token')
          fetch(`http://localhost:5000/api/rooms/${roomId}/game`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
              mousePos: 0,
              catPos: 5,
              turn: 'mouse',
              winner: null,
              moveCount: 0
            })
          }).then(() => {
            fetch(`http://localhost:5000/api/rooms/${roomId}/rematch`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ reset: true })
            })
          })
        }
        setRematch(false)
        setOpponentRematch(false)
      }
    }
  }, [room, roomId, username])

  const handleMove = async (to) => {
    if (!game || game.winner) return
    const token = localStorage.getItem('token')
    if (role === 'mouse' && game.turn === 'mouse' && isNeighbor(game.mousePos, to) && to !== game.catPos) {
      await fetch(`http://localhost:5000/api/rooms/${roomId}/game`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          ...game,
          mousePos: to,
          turn: 'cat',
          moveCount: game.moveCount + 1,
          winner: (game.moveCount + 1) >= 15 ? 'mouse' : null
        })
      })
      // Jeśli mysz wygrała, wyślij wynik do backendu
      if ((game.moveCount + 1) >= 15) {
        await fetch(`http://localhost:5000/api/rooms/${roomId}/result`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ winner: 'mouse' })
        })
      }
    }
    if (role === 'cat' && game.turn === 'cat' && isNeighbor(game.catPos, to) && to !== game.mousePos) {
      let winner = null
      const mouseMoves = nodes
        .filter(n => isNeighbor(game.mousePos, n.id) && n.id !== to)
        .map(n => n.id)
      const allDanger = mouseMoves.length > 0 && mouseMoves.every(nid => isNeighbor(to, nid))
      if (allDanger || to === game.mousePos) winner = 'cat'
      await fetch(`http://localhost:5000/api/rooms/${roomId}/game`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          ...game,
          catPos: to,
          turn: winner ? null : 'mouse',
          winner
        })
      })
      // Jeśli kot wygrał, wyślij wynik do backendu
      if (winner) {
        await fetch(`http://localhost:5000/api/rooms/${roomId}/result`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ winner: 'cat' })
        })
      }
    }
  }

  const handleLeave = async () => {
    const token = localStorage.getItem('token')
    await fetch(`http://localhost:5000/api/rooms/${roomId}/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ username }),
    })
    setLeft(true)
    localStorage.removeItem('roomId')
    if (onBack) onBack()
  }

  const handleRematch = async () => {
    setRematch(true)
    const token = localStorage.getItem('token')
    await fetch(`http://localhost:5000/api/rooms/${roomId}/rematch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ username })
    })
  }

  if (loading) return <div className="game-info">Ładowanie pokoju...</div>
  if (left) return null
  if (!room) return <div className="game-info">Pokój nie istnieje</div>
  if (!room.players || room.players.length < 2) {
    return (
      <div className="game-info">
        <h2>Pokój: {room.name}</h2>
        <div>
          Gracze: {room.players && room.players.join(', ')}
        </div>
        <div style={{ margin: '2rem 0', fontWeight: 'bold', color: '#27ae60' }}>
          Oczekiwanie na przeciwnika...
        </div>
        <button onClick={handleLeave}>Wyjdź</button>
      </div>
    )
  }
  if (!game) {
    return (
      <div className="game-info">
        <h2>Inicjalizacja gry...</h2>
        <button onClick={handleLeave}>Wyjdź</button>
      </div>
    )
  }

  // Widok gry
  return (
    <div className="game-container">
      <h1>Kot i Mysz (Multiplayer)</h1>
      <div className="game-role-info">
        Twoja rola: {role === 'mouse' ? '🐭 Mysz' : '🐱 Kot'}
      </div>
      <svg width={600} height={600} className="game-board">
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x * 1.5}
            y1={nodes[a].y * 1.5}
            x2={nodes[b].x * 1.5}
            y2={nodes[b].y * 1.5}
            stroke="#222"
            strokeWidth={4}
          />
        ))}
        {nodes.map((node) => {
          let color = '#fff'
          if (node.id === game.mousePos) color = 'gold'
          if (node.id === game.catPos) color = 'tomato'
          let clickable = false
          if (role === 'mouse' && game.turn === 'mouse' && isNeighbor(game.mousePos, node.id) && node.id !== game.catPos) clickable = true
          if (role === 'cat' && game.turn === 'cat' && isNeighbor(game.catPos, node.id) && node.id !== game.mousePos) clickable = true
          return (
            <g key={node.id}>
              <circle
                cx={node.x * 1.5}
                cy={node.y * 1.5}
                r={42}
                fill={color}
                stroke="#222"
                strokeWidth={4}
                style={{ cursor: clickable ? 'pointer' : 'default', opacity: 1 }}
                onClick={() => clickable && handleMove(node.id)}
              />
              <text
                x={node.x * 1.5}
                y={node.y * 1.5 + 12}
                textAnchor="middle"
                fontSize={node.id === game.mousePos ? 42 : node.id === game.catPos ? 42 : 30}
                fontFamily="monospace"
              >
                {node.id === game.mousePos ? '🐭' : node.id === game.catPos ? '🐱' : ''}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="game-status">
        {game.winner ? (
          <>
            <div className="game-winner">
              {game.winner === 'mouse'
                ? 'Wygrała mysz! 🐭'
                : 'Wygrał kot! 🐱'}
            </div>
            <div className="game-rematch-buttons">
              {!rematch && (
                <button
                  className="game-rematch-btn"
                  onClick={handleRematch}
                >
                  Zagraj jeszcze raz
                </button>
              )}
              <button
                className="game-rematch-btn"
                onClick={handleLeave}
              >
                Wyjdź
              </button>
            </div>
            {rematch && !opponentRematch && (
              <div className="game-rematch-info">
                Czekasz na decyzję przeciwnika...
              </div>
            )}
            {rematch && opponentRematch && (
              <div className="game-rematch-info">
                Obaj gracze chcą zagrać ponownie! Nowa gra za chwilę...
              </div>
            )}
            {!rematch && opponentRematch && (
              <div className="game-rematch-info">
                Przeciwnik chce zagrać ponownie. Kliknij "Zagraj jeszcze raz", aby rozpocząć nową grę.
              </div>
            )}
          </>
        ) : (
          `Tura: ${game.turn === 'mouse' ? 'mysz' : 'kot'} | Ruch: ${game.moveCount}/15`
        )}
      </div>
      {!game.winner && (
        <div className="game-buttons">
          <button onClick={handleLeave}>Wyjdź</button>
        </div>
      )}
    </div>
  )
}