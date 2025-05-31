import { useState } from 'react'
import GameLocal from './GameLocal'
import GameVsAi from './GameVsAi'
import RoomsView from './RoomsView'

export default function MainView({ username, setToast }) {
  const [mode, setMode] = useState(null)

  if (mode === 'local') {
    return <GameLocal onBack={() => setMode(null)} />
  }
  if (mode === 'ai') {
    return <GameVsAi onBack={() => setMode(null)} username={username} />
  }
  if (mode === 'rooms') {
    return <RoomsView onBack={() => setMode(null)} setToast={setToast} username={username} />
  }

  return (
    <div
      className="game-info"
      style={{
        maxWidth: 800,
        width: '98vw',
        margin: '40px auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 500,
      }}
    >
      <div
        style={{
          width: '100%',
          background: '#23272a',
          borderRadius: 20,
          padding: 60,
          boxShadow: '0 6px 36px #000b',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 40,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 32, textAlign: 'center', fontSize: 32 }}>Wybierz tryb gry</h1>
        <div className="button-row" style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 24 }}>
          <button style={{ fontSize: 16, padding: '18px 20px' }} onClick={() => setMode('local')}>Graj na jednym komputerze</button>
          <button style={{ fontSize: 16, padding: '18px 20px' }} onClick={() => setMode('rooms')}>Graj z innymi</button>
          <button style={{ fontSize: 16, padding: '18px 20px' }} onClick={() => setMode('ai')}>Graj z komputerem</button>
        </div>
      </div>
    </div>
  )
}