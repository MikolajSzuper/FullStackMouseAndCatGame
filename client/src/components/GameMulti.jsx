import { useEffect, useState, useRef } from 'react'

export default function RoomGameView({ roomId, username, onBack }) {
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const [left, setLeft] = useState(false)
  const intervalRef = useRef()

  // Polling co 2 sekundy na stan pokoju
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      fetch(`http://localhost:5000/api/rooms/${roomId}`)
        .then(res => res.json())
        .then(data => {
          setRoom(data)
          setLoading(false)
          if (Array.isArray(data.players) && data.players.length === 2) {
            setGameStarted(true)
          } else {
            setGameStarted(false)
          }
        })
        .catch(() => {
          setRoom(null)
          setLoading(false)
        })
    }, 2000)
    // pobierz od razu na start
    fetch(`http://localhost:5000/api/rooms/${roomId}`)
      .then(res => res.json())
      .then(data => {
        setRoom(data)
        setLoading(false)
        if (Array.isArray(data.players) && data.players.length === 2) {
          setGameStarted(true)
        }
      })
      .catch(() => {
        setRoom(null)
        setLoading(false)
      })
    return () => clearInterval(intervalRef.current)
  }, [roomId])

  const handleLeave = async () => {
    await fetch(`http://localhost:5000/api/rooms/${roomId}/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    })
    setLeft(true)
    onBack()
  }

  if (loading) return <div className="game-info">Ładowanie pokoju...</div>
  if (left) return null
  if (!room) return <div className="game-info">Pokój nie istnieje</div>

  if (!gameStarted) {
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

  // Tutaj możesz podmienić na komponent gry online
  return (
    <div className="game-info">
      <h2>Gra rozpoczęta!</h2>
      <div>
        Gracze: {room.players && room.players.join(', ')}
      </div>
      {/* Komponent gry online */}
      <button onClick={handleLeave}>Wyjdź</button>
    </div>
  )
}