import { useEffect, useState } from 'react'
import GameMulti from './GameMulti'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function RoomsView({ onBack, setToast, username }) {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [newRoomName, setNewRoomName] = useState('')
  const [joinedRoomId, setJoinedRoomId] = useState(null)

  useEffect(() => {
    const savedRoomId = localStorage.getItem('roomId')
    const token = localStorage.getItem('token')
    if (savedRoomId) {
      setJoinedRoomId(savedRoomId)
      return
    }
    fetch(`${API_URL}/api/rooms`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
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
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/api/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
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
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/api/rooms/${roomId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
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
    const token = localStorage.getItem('token')
    fetch(`${API_URL}/api/rooms`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(setRooms)
      .finally(() => setLoading(false))
  }

  if (joinedRoomId) {
    return <GameMulti roomId={joinedRoomId} username={username} onBack={onBack} />
  }

  return (
    <div className="game-info rooms-container">
      <div className="rooms-content">
        <h1 className="rooms-header">
          Dostępne pokoje
          <button
            className="rooms-refresh-btn"
            onClick={refreshRooms}
            disabled={loading}
            title="Odśwież listę pokoi"
          >
            <span className="rooms-refresh-icon">&#x21bb;</span>
          </button>
        </h1>
        {loading ? (
          <div>Ładowanie...</div>
        ) : (
          <>
            <div className="rooms-list">
              {(Array.isArray(rooms) ? rooms : []).length === 0 ? (
                <div className="rooms-empty">
                  Brak dostępnych pokoi.<br />Załóż własny pokój i zaproś znajomego do gry!
                </div>
              ) : (
                (Array.isArray(rooms) ? rooms : []).map(room => (
                  <div key={room.id} className="room-card">
                    <div className="room-card-title">{room.name}</div>
                    <div className="room-card-info">
                      <span>ID:</span> {room.id}
                    </div>
                    <div className="room-card-info">
                      <span>Gracze:</span>{' '}
                      {Array.isArray(room.players)
                        ? room.players.join(', ')
                        : (room.players || 1)}
                    </div>
                    <button
                      className="room-card-btn"
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
            <form onSubmit={handleCreateRoom} className="rooms-create-form">
              <input
                type="text"
                placeholder="Nazwa nowego pokoju"
                value={newRoomName}
                onChange={e => setNewRoomName(e.target.value)}
                className="rooms-create-input"
              />
              <button type="submit">Utwórz pokój</button>
            </form>
            <button className="rooms-back-btn" onClick={onBack}>Powrót</button>
          </>
        )}
      </div>
    </div>
  )
}