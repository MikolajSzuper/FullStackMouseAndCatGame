import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Sidebar from './components/Sidebar'
import MainView from './components/MainView'
import Toast from './components/Toast'
import './App.css'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [activeView, setActiveView] = useState('main')
  const [toast, setToast] = useState({ message: '', type: '' })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetch('http://localhost:5000/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
          setIsAuthenticated(true)
          setUsername(data.username)
        })
        .catch(() => {
          setIsAuthenticated(false)
          setUsername('')
          localStorage.removeItem('token')
        })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setShowRegister(false)
    setIsAuthenticated(false)
    setUsername('')
    setToast({ message: 'Wylogowano pomyślnie', type: 'success' })
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="auth-bg">
          <div className="auth-container">
            {showRegister ? (
              <RegisterForm onSuccess={(username) => {setIsAuthenticated(true), setUsername(username)}} setToast={setToast} />
            ) : (
              <LoginForm onSuccess={(username) => { setIsAuthenticated(true); setUsername(username); }} setToast={setToast} />
            )}
            <button
              className="toggle-btn"
              onClick={() => setShowRegister((v) => !v)}
            >
              {showRegister ? 'Masz konto? Zaloguj się' : 'Nie masz konta? Zarejestruj się'}
            </button>
          </div>
        </div>
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      </>
    )
  }

  let content
  if (activeView === 'main') {
    content = <MainView username={username} setToast={setToast} />
  } else if (activeView === 'stats') {
    content = <div>Statystyki</div>
  } else if (activeView === 'profile') {
    content = <div>Profil użytkownika</div>
  }

  return (
    <>
      <div className="main-bg">
        <div className="main-layout">
          <Sidebar
            username={username}
            onSelect={setActiveView}
            onLogout={handleLogout}
          />
          <div className="content">
            {content}
          </div>
        </div>
      </div>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: '' })}
      />
    </>
  )
}