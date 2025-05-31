import { useEffect, useState } from 'react'
import GameMulti from './GameMulti'

export default function RoomsView({ onBack, setToast, username }) {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [newRoomName, setNewRoomName] = useState('')
  const [joinedRoomId, setJoinedRoomId] = useState(null)

  useEffect(() => {
    const savedRoomId = localStorage.getItem('roomId')
    if (savedRoomId) {
      setJoinedRoomId(savedRoomId)
      return
    }
    fetch('http://localhost:5000/api/rooms')
      .then(res => res.json())
      .then(setRooms)
      .finally(() => setLoading(false))
  }, [])

  const handleCreateRoom = async (e) => {
    e.preventDefault()
    if (!newRoomName.trim()) {
      setToast({ message: 'Podaj nazwę pokoju', type: 'error' })
      return
    }
    const res = await fetch('http://localhost:5000/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newRoomName, username }),
    })
    if (res.ok) {
      const room = await res.json()
      setJoinedRoomId(room.id)
      localStorage.setItem('roomId', room.id) 
      setToast({ message: 'Pokój utworzony!', type: 'success' })
    } else {
      setToast({ message: 'Nie udało się utworzyć pokoju', type: 'error' })
    }
  }

  const handleJoinRoom = async (roomId) => {
    const res = await fetch(`http://localhost:5000/api/rooms/${roomId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    })
    if (res.ok) {
      setJoinedRoomId(roomId)
      localStorage.setItem('roomId', roomId) 
    } else {
      setToast({ message: 'Nie udało się dołączyć do pokoju', type: 'error' })
    }
  }

  const refreshRooms = () => {
    setLoading(true)
    fetch('http://localhost:5000/api/rooms')
      .then(res => res.json())
      .then(setRooms)
      .finally(() => setLoading(false))
  }

  if (joinedRoomId) {
    return <GameMulti roomId={joinedRoomId} username={username} onBack={onBack} />
  }

  return (
    <div className="game-info">
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        Dostępne pokoje
        <button
          style={{
            marginBottom: 0,
            marginLeft: 8,
            background: 'none',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={refreshRooms}
          disabled={loading}
          title="Odśwież listę pokoi"
        >
          <span style={{ fontSize: 28, color: '#27ae60', display: 'flex', alignItems: 'center' }}>
            &#x21bb;
          </span>
        </button>
      </h1>
      {loading ? (
        <div>Ładowanie...</div>
      ) : (
        <>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            marginBottom: 32,
            width: '100%',
          }}>
            {rooms.length === 0 ? (
              <div style={{
                color: '#aaa',
                fontSize: 18,
                padding: 32,
                width: '100%',
                textAlign: 'center'
              }}>
                Brak dostępnych pokoi.<br />Załóż własny pokój i zaproś znajomego do gry!
              </div>
            ) : (
              rooms.map(room => (
                <div
                  key={room.id}
                  style={{
                    background: '#23272a',
                    borderRadius: 12,
                    boxShadow: '0 2px 12px #000a',
                    padding: 20,
                    minWidth: 260,
                    maxWidth: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    position: 'relative'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8 }}>{room.name}</div>
                  <div style={{ fontSize: 15, marginBottom: 8 }}>
                    <span style={{ color: '#27ae60', fontWeight: 'bold' }}>ID:</span> {room.id}
                  </div>
                  <div style={{ fontSize: 15, marginBottom: 8 }}>
                    <span style={{ color: '#27ae60', fontWeight: 'bold' }}>Gracze:</span>{' '}
                    {Array.isArray(room.players)
                      ? room.players.join(', ')
                      : (room.players || 1)}
                  </div>
                  <button
                    style={{
                      marginTop: 'auto',
                      width: '100%',
                      background: Array.isArray(room.players) && room.players.length >= 2 ? '#555' : '#27ae60',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '0.7rem',
                      fontWeight: 'bold',
                      cursor: Array.isArray(room.players) && room.players.length >= 2 ? 'not-allowed' : 'pointer'
                    }}
                    disabled={Array.isArray(room.players) && room.players.length >= 2}
                    title={Array.isArray(room.players) && room.players.length >= 2 ? 'Pokój pełny' : 'Dołącz do pokoju'}
                    onClick={() => handleJoinRoom(room.id)}
                  >
                    Dołącz
                  </button>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleCreateRoom} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Nazwa nowego pokoju"
              value={newRoomName}
              onChange={e => setNewRoomName(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit">Utwórz pokój</button>
          </form>
          <button style={{ marginTop: 8 }} onClick={onBack}>Powrót</button>
        </>
      )}
    </div>
  )
}