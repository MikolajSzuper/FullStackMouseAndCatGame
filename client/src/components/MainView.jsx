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
    <div className="game-info mainview-container">
      <div className="mainview-inner">
        <h1 className="mainview-title">Wybierz tryb gry</h1>
        <div className="button-row mainview-btnrow">
          <button style={{ fontSize: 16, padding: '18px 20px' }} onClick={() => setMode('local')}>Graj na jednym komputerze</button>
          <button style={{ fontSize: 16, padding: '18px 20px' }} onClick={() => setMode('rooms')}>Graj z innymi</button>
          <button style={{ fontSize: 16, padding: '18px 20px' }} onClick={() => setMode('ai')}>Graj z komputerem</button>
        </div>
      </div>
    </div>
  )
}