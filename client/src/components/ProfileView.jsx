import { useEffect, useState } from 'react'

export default function ProfileView({ username, setToast }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({ username: '', email: '', password: '', newPassword: '' })

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:5000/api/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data)
        setForm({ username: data.username, email: data.email || '', password: '', newPassword: '' })
        setLoading(false)
      })
      .catch(() => {
        setToast({ message: 'Błąd ładowania profilu', type: 'error' })
        setLoading(false)
      })
  }, [setToast])

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:5000/api/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          newPassword: form.newPassword
        })
      })
      const data = await res.json()
      if (res.ok) {
        setToast({ message: 'Zaktualizowano profil', type: 'success' })
        setUser(data)
        setEdit(false)
        setForm(f => ({ ...f, password: '', newPassword: '' }))
        if (data.username) localStorage.setItem('username', data.username)
      } else {
        setToast({ message: data.error, type: 'error' })
      }
    } catch {
      setToast({ message: 'Błąd połączenia z serwerem', type: 'error' })
    }
  }

  const handleCancel = () => {
    setEdit(false)
    setForm(f => ({ ...f, password: '', newPassword: '' }))
    setToast({ message: '', type: '' })
  }

  if (loading) return <div className="game-info">Ładowanie profilu...</div>
  if (!user) return <div className="game-info">Nie znaleziono użytkownika</div>

  return (
    <div
      className="game-info"
      style={{
        maxWidth: 700,
        width: '90vw',
        margin: '32px auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: 500
      }}
    >
      <div style={{
        width: '100%',
        background: '#23272a',
        borderRadius: 16,
        padding: 40,
        boxShadow: '0 4px 32px #000a',
        display: 'flex',
        flexDirection: 'column',
        gap: 32
      }}>
        <h1 style={{ marginTop: 0, marginBottom: 16, textAlign: 'center' }}>Profil użytkownika</h1>
        <div style={{ marginBottom: 0, fontSize: 18 }}>
          <b>Nazwa użytkownika:</b> {user.username}<br />
          <b>Email:</b> {user.email || '-'}<br />
          <b>Zarejestrowany:</b> {user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}
        </div>
        <div style={{ marginBottom: 0, fontSize: 18 }}>
          <b>Statystyki:</b><br />
          Rozegrane gry: {user.stats?.games ?? 0}<br />
          Wygrane: {user.stats?.wins ?? 0}<br />
          Przegrane: {user.stats?.losses ?? 0}
        </div>
        {!edit && (
          <button onClick={() => setEdit(true)} style={{
            width: '100%',
            padding: '12px 0',
            fontSize: 16,
            background: '#27ae60',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>Edytuj profil</button>
        )}
        {edit && (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{ fontSize: 16 }}>
              Nazwa użytkownika (po zmiane nazwy konieczne zalogowanie się ponownie):
              <input name="username" value={form.username} onChange={handleChange} required style={{ width: '100%', marginTop: 4 }} />
            </label>
            <label style={{ fontSize: 16 }}>
              Email:
              <input name="email" value={form.email} onChange={handleChange} type="email" required style={{ width: '100%', marginTop: 4 }} />
            </label>
            <label style={{ fontSize: 16 }}>
              Aktualne hasło:
              <input name="password" value={form.password} onChange={handleChange} type="password" required style={{ width: '100%', marginTop: 4 }} />
            </label>
            <label style={{ fontSize: 16 }}>
              Nowe hasło:
              <input name="newPassword" value={form.newPassword} onChange={handleChange} type="password" style={{ width: '100%', marginTop: 4 }} />
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={{
                flex: 1,
                padding: '10px 0',
                background: '#27ae60',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 'bold',
                fontSize: 16,
                cursor: 'pointer'
              }}>Zapisz</button>
              <button type="button" onClick={handleCancel} style={{
                flex: 1,
                padding: '10px 0',
                background: '#c0392b',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 'bold',
                fontSize: 16,
                cursor: 'pointer'
              }}>Anuluj</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}