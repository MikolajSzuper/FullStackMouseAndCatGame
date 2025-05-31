import { useState } from 'react'

export default function LoginForm({ onSuccess, setToast }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    if (res.ok) {
      localStorage.setItem('token', data.token)
      setToast({ message: 'Zalogowano pomyślnie!', type: 'success' })
      onSuccess()
    } else {
      setToast({ message: data.error, type: 'error' })
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', height: '100%' }}>
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