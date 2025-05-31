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
    return <GameVsAi onBack={() => setMode(null)} />
  }
  if (mode === 'rooms') {
    return <RoomsView onBack={() => setMode(null)} setToast={setToast} />
  }

  return (
    <div className="game-info">
      <h1>Wybierz tryb gry</h1>
      <div className="button-row">
        <button onClick={() => setMode('local')}>Graj na jednym komputerze</button>
        <button onClick={() => setMode('rooms')}>Graj z innymi</button>
        <button onClick={() => setMode('ai')}>Graj z komputerem</button>
      </div>
    </div>
  )
}