import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Sidebar from './components/Sidebar'
import MainView from './components/MainView'
import Toast from './components/Toast'
import HelpView from './components/HelpView'
import ProfileView from './components/ProfileView'
import StatsView from './components/StatsView'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [activeView, setActiveView] = useState('main')
  const [toast, setToast] = useState({ message: '', type: '' })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetch(`${API_URL}/api/me`, {
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
          localStorage.removeItem('roomId')
        })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('roomId')
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
              <RegisterForm onSuccess={(username) => { setIsAuthenticated(true); setUsername(username) }} setToast={setToast} />
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
    content = <StatsView />
  } else if (activeView === 'profile') {
    content = <ProfileView username={username} setToast={setToast} />
  } else if (activeView === 'help') {
    content = <HelpView />
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