import { useState, useEffect } from 'react'

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

function getCatMoveRandom(catPos, mousePos) {
  const neighbors = nodes.filter(n => isNeighbor(catPos, n.id) && n.id !== mousePos)
  if (neighbors.length === 0) return catPos
  const idx = Math.floor(Math.random() * neighbors.length)
  return neighbors[idx].id
}

export default function GameVsAi({ onBack }) {
  // Losowanie ról na początku gry
  const [playerRole, setPlayerRole] = useState(null) // 'mouse' lub 'cat'
  const [mousePos, setMousePos] = useState(0)
  const [catPos, setCatPos] = useState(5)
  const [turn, setTurn] = useState('mouse')
  const [winner, setWinner] = useState(null)
  const [moveCount, setMoveCount] = useState(0)

  // Losuj role tylko raz na start
  useEffect(() => {
    setPlayerRole(Math.random() < 0.5 ? 'mouse' : 'cat')
    setMousePos(0)
    setCatPos(5)
    setTurn('mouse')
    setWinner(null)
    setMoveCount(0)
  }, [])

  function restartGame() {
    setPlayerRole(Math.random() < 0.5 ? 'mouse' : 'cat')
    setMousePos(0)
    setCatPos(5)
    setTurn('mouse')
    setWinner(null)
    setMoveCount(0)
  }

  function handlePlayerMove(to) {
    if (winner) return
    if (playerRole === 'mouse' && turn === 'mouse' && isNeighbor(mousePos, to) && to !== catPos) {
      setMousePos(to)
      setMoveCount(c => {
        const next = c + 1
        if (next >= 15) {
          setWinner('mouse')
          return next
        }
        setTurn('cat')
        return next
      })
    }
    if (playerRole === 'cat' && turn === 'cat' && isNeighbor(catPos, to) && to !== mousePos) {
      setCatPos(to)
      setTimeout(() => {
        const mouseMoves = nodes
          .filter(n => isNeighbor(mousePos, n.id) && n.id !== catPos)
          .map(n => n.id)
        const allDanger = mouseMoves.length > 0 && mouseMoves.every(nid => isNeighbor(to, nid))
        if (allDanger || to === mousePos) {
          setWinner('cat')
        } else {
          setTurn('mouse')
        }
      }, 0)
    }
  }

  // AI ruch
  useEffect(() => {
    if (winner || playerRole === null) return
    if (playerRole === 'mouse' && turn === 'cat') {
      // AI gra kotem - losowy ruch
      const newCatPos = getCatMoveRandom(catPos, mousePos)
      setTimeout(() => {
        setCatPos(newCatPos)
        const mouseMoves = nodes
          .filter(n => isNeighbor(mousePos, n.id) && n.id !== newCatPos)
          .map(n => n.id)
        const allDanger = mouseMoves.length > 0 && mouseMoves.every(nid => isNeighbor(newCatPos, nid))
        if (allDanger || newCatPos === mousePos) {
          setWinner('cat')
        } else {
          setTurn('mouse')
        }
      }, 500)
    }
    if (playerRole === 'cat' && turn === 'mouse') {
      // AI gra myszą - losowy ruch na sąsiednie pole nie zajęte przez kota
      const moves = nodes.filter(n => isNeighbor(mousePos, n.id) && n.id !== catPos)
      if (moves.length > 0) {
        const move = moves[Math.floor(Math.random() * moves.length)]
        setTimeout(() => {
          setMousePos(move.id)
          setMoveCount(c => {
            const next = c + 1
            if (next >= 15) {
              setWinner('mouse')
              return next
            }
            setTurn('cat')
            return next
          })
        }, 500)
      }
    }
  }, [turn, playerRole, catPos, mousePos, winner])

  let info = ''
  if (playerRole === null) {
    info = 'Losowanie ról...'
  } else if (playerRole === 'mouse') {
    info = 'Twoja rola: 🐭 Mysz'
  } else {
    info = 'Twoja rola: 🐱 Kot'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Kot i Mysz (vs Komputer)</h1>
      <div style={{ marginBottom: 12, fontWeight: 'bold', fontSize: 20 }}>{info}</div>
      <svg width={600} height={600} style={{ background: 'mediumseagreen', borderRadius: 16 }}>
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
          if (node.id === mousePos) color = 'gold'
          if (node.id === catPos) color = 'tomato'
          // Gracz może klikać tylko swoją postacią w swojej turze
          let clickable = false
          if (playerRole === 'mouse' && turn === 'mouse' && isNeighbor(mousePos, node.id) && node.id !== catPos) clickable = true
          if (playerRole === 'cat' && turn === 'cat' && isNeighbor(catPos, node.id) && node.id !== mousePos) clickable = true
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
                onClick={() => clickable && handlePlayerMove(node.id)}
              />
              <text
                x={node.x * 1.5}
                y={node.y * 1.5 + 12}
                textAnchor="middle"
                fontSize={node.id === mousePos ? 42 : node.id === catPos ? 42 : 30}
                fontFamily="monospace"
              >
                {node.id === mousePos ? '🐭' : node.id === catPos ? '🐱' : ''}
              </text>
            </g>
          )
        })}
      </svg>
      <div style={{ marginTop: 24 }}>
        {winner
          ? winner === 'mouse'
            ? 'Wygrała mysz! 🐭'
            : 'Wygrał kot! 🐱'
          : `Tura: ${turn === 'mouse' ? 'mysz' : 'kot'} | Ruch: ${moveCount}/15`}
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
        <button onClick={restartGame}>Restart</button>
        <button onClick={onBack}>Powrót</button>
      </div>
    </div>
  )
}