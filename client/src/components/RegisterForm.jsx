import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function RegisterForm({ onSuccess, setToast }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== repeatPassword) {
      setToast({ message: 'Hasła nie są takie same', type: 'error' })
      return
    }
    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      setToast({ message: 'Podaj poprawny adres e-mail', type: 'error' })
      return
    }
    const res = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
    const data = await res.json()
    if (res.ok) {
      const loginRes = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const loginData = await loginRes.json()
      if (loginRes.ok) {
        localStorage.setItem('token', loginData.token)
        setToast({ message: 'Konto utworzone i zalogowano!', type: 'success' })
        onSuccess(username) 
      } else {
        setToast({ message: 'Rejestracja udana, ale logowanie nie powiodło się.', type: 'error' })
      }
    } else {
      setToast({ message: data.error, type: 'error' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Rejestracja</h2>
      <label htmlFor="register-username" className="input-label">Nazwa użytkownika</label>
      <input
        id="register-username"
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <label htmlFor="register-email" className="input-label">E-mail</label>
      <input
        id="register-email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <label htmlFor="register-password" className="input-label">Hasło</label>
      <input
        id="register-password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <label htmlFor="register-repeat-password" className="input-label">Powtórz hasło</label>
      <input
        id="register-repeat-password"
        type="password"
        value={repeatPassword}
        onChange={e => setRepeatPassword(e.target.value)}
        required
      />
      <button type="submit">Zarejestruj</button>
    </form>
  )
}