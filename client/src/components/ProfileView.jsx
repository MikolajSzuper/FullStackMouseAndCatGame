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
    <div className="game-info profile-container">
      <div className="profile-content">
        <h1>Profil użytkownika</h1>
        <div className="profile-info">
          <b>Nazwa użytkownika:</b> {user.username}<br />
          <b>Email:</b> {user.email || '-'}<br />
          <b>Zarejestrowany:</b> {user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}
        </div>
        <div className="profile-info">
          <b>Statystyki:</b><br />
          Rozegrane gry: {user.stats?.games ?? 0}<br />
          Wygrane: {user.stats?.wins ?? 0}<br />
          Przegrane: {user.stats?.losses ?? 0}
        </div>
        {!edit && (
          <button
            onClick={() => setEdit(true)}
            className="profile-edit-btn save"
          >Edytuj profil</button>
        )}
        {edit && (
          <form onSubmit={handleSave} className="profile-edit-form">
            <label className="profile-edit-label">
              Nazwa użytkownika (po zmiane nazwy konieczne zalogowanie się ponownie):
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="profile-edit-input"
              />
            </label>
            <label className="profile-edit-label">
              Email:
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                required
                className="profile-edit-input"
              />
            </label>
            <label className="profile-edit-label">
              Aktualne hasło:
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                required
                className="profile-edit-input"
              />
            </label>
            <label className="profile-edit-label">
              Nowe hasło:
              <input
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                type="password"
                className="profile-edit-input"
              />
            </label>
            <div className="profile-edit-btn-row">
              <button type="submit" className="profile-edit-btn save">Zapisz</button>
              <button type="button" onClick={handleCancel} className="profile-edit-btn cancel">Anuluj</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}