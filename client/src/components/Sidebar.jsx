import { useState } from 'react'

export default function Sidebar({ username, avatarUrl, onSelect, onLogout }) {
  const [active, setActive] = useState('main')

  const handleSelect = (view) => {
    setActive(view)
    onSelect(view)
  }

  return (
    <div className="sidebar">
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
        <img
          src={avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(username)}
          alt="avatar"
          style={{ width: 64, height: 64, borderRadius: '50%', marginBottom: 12, background: '#181a1b' }}
        />
        <div style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: 4 }}>{username}</div>
      </div>
      <button
        className={active === 'main' ? 'sidebar-btn active' : 'sidebar-btn'}
        onClick={() => handleSelect('main')}
      >
        Strona główna
      </button>
      <button
        className={active === 'stats' ? 'sidebar-btn active' : 'sidebar-btn'}
        onClick={() => handleSelect('stats')}
      >
        Statystyki
      </button>
      <button
        className={active === 'profile' ? 'sidebar-btn active' : 'sidebar-btn'}
        onClick={() => handleSelect('profile')}
      >
        Profil
      </button>
      <button
        className="sidebar-btn"
        style={{ marginTop: 'auto',textAlign: 'center', background: '#c0392b' }}
        onClick={onLogout}
      >
        Wyloguj
      </button>
    </div>
  )
}