import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function StatsView() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/stats`)
      .then(res => res.json())
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="stats-info">Ładowanie statystyk...</div>
  if (!stats) return <div className="stats-info">Brak danych statystycznych</div>

  const maxWins = Math.max(...stats.topWinners.map(u => u.stats.wins), 1)
  return (
    <div className="stats-container">
      <div
        className="stats-info"
        style={{
          maxWidth: 1200,
          width: '100%',
          margin: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 32,
          justifyContent: 'center',
          alignItems: 'stretch',
          minHeight: 400,
          paddingBottom: 32,
        }}
      >
        {/* Kafelek 1: Wykres */}
        <div style={{
          background: '#23272a',
          borderRadius: 16,
          padding: 32,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 4px 32px #000a'
        }}>
          <h2 style={{ textAlign: 'center' }}>Top 10 graczy (wygrane)</h2>
          <svg width="100%" height={180} viewBox={`0 0 620 180`} style={{ maxWidth: 620 }}>
            {stats.topWinners.slice(0, 10).map((u, i) => (
              <g key={u.username}>
                <rect
                  x={20 + i * 60}
                  y={160 - (u.stats.wins / maxWins) * 120}
                  width={40}
                  height={(u.stats.wins / maxWins) * 120}
                  fill="#27ae60"
                />
                <text x={40 + i * 60} y={175} textAnchor="middle" fontSize={14} fill="#fff">{u.username}</text>
                <text x={40 + i * 60} y={150 - (u.stats.wins / maxWins) * 120} textAnchor="middle" fontSize={14} fill="#fff">{u.stats.wins}</text>
              </g>
            ))}
          </svg>
        </div>
        {/* Kafelek 2: Ostatnio zarejestrowani */}
        <div style={{
          background: '#23272a',
          borderRadius: 16,
          padding: 32,
          minWidth: 0,
          boxShadow: '0 4px 32px #000a'
        }}>
          <h2 style={{ textAlign: 'center' }}>Ostatnio zarejestrowani</h2>
          <ol>
            {stats.lastRegistered.map(u => (
              <li key={u.username}>
                <b>{u.username}</b> <span style={{ color: '#aaa', fontSize: 13 }}>({new Date(u.createdAt).toLocaleDateString()})</span>
              </li>
            ))}
          </ol>
        </div>
        {/* Kafelek 3: Najgorsi gracze */}
        <div style={{
          background: '#23272a',
          borderRadius: 16,
          padding: 32,
          minWidth: 0,
          boxShadow: '0 4px 32px #000a'
        }}>
          <h2 style={{ textAlign: 'center' }}>Najgorsi gracze</h2>
          <ol>
            {stats.topLosers.map(u => (
              <li key={u.username}>
                <b>{u.username}</b> — {u.stats.losses} przegranych
              </li>
            ))}
          </ol>
        </div>
        {/* Kafelek 4: Ogólne dane */}
        <div style={{
          background: '#23272a',
          borderRadius: 16,
          padding: 32,
          minWidth: 0,
          boxShadow: '0 4px 32px #000a'
        }}>
          <h2 style={{ textAlign: 'center' }}>Ogólne dane</h2>
          <div>Liczba graczy: <b>{stats.totalUsers}</b></div>
          <div>Rozegrane gry: <b>{stats.totalGames}</b></div>
          <div>Średnia wygranych na gracza: <b>{stats.avgWins.toFixed(2)}</b></div>
          <div>Średnia przegranych na gracza: <b>{stats.avgLosses.toFixed(2)}</b></div>
        </div>
      </div>
    </div>
  )
}