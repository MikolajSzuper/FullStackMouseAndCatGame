import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function LoginForm({ onSuccess, setToast }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    if (res.ok) {
      localStorage.setItem('token', data.token)
      setToast({ message: 'Zalogowano pomyślnie!', type: 'success' })
      fetch(`${API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${data.token}` }
      })
        .then(res => res.json())
        .then(userData => onSuccess(userData.username))
    } else {
      setToast({ message: data.error, type: 'error' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Zaloguj się</h2>
      <label htmlFor="login-username" className="input-label">Nazwa użytkownika</label>
      <input
        id="login-username"
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <label htmlFor="login-password" className="input-label">Hasło</label>
      <input
        id="login-password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Zaloguj</button>
    </form>
  )
}