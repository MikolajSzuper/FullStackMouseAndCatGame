import { useEffect, useState } from 'react'

export default function Toast({ message, type, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setVisible(true)
      const hideTimer = setTimeout(() => setVisible(false), 2700)
      const closeTimer = setTimeout(onClose, 3000)
      return () => {
        clearTimeout(hideTimer)
        clearTimeout(closeTimer)
      }
    }
  }, [message, onClose])

  if (!message) return null

  return (
    <div
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        minWidth: 220,
        background: type === 'success' ? '#27ae60' : '#c0392b',
        color: '#fff',
        padding: '1rem 1.5rem',
        borderRadius: 8,
        boxShadow: '0 2px 16px #000a',
        zIndex: 1000,
        fontWeight: 'bold',
        fontSize: '1em',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s',
        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  )
}