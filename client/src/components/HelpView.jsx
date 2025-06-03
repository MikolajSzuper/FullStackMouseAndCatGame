import React from 'react'

export default function HelpView() {
  return (
      <div className="help-content">
        <h1>Jak grać w "Kot i Mysz"?</h1>
        <p>
          <strong>Cel gry:</strong><br />
          Gra toczy się na planszy z 6 polami. Jeden gracz steruje myszą 🐭, drugi kotem 🐱.<br />
          Mysz wygrywa, jeśli przetrwa 15 ruchów unikając złapania.<br />
          Kot wygrywa, jeśli złapie mysz w pułapkę czyli wszystkie możliwe ruchy będą na jedną odległość od kota.
        </p>
        <h2>Zasady ruchu:</h2>
        <ul>
          <li>Gracze wykonują ruchy na zmianę: najpierw mysz, potem kot.</li>
          <li>Można przesuwać się tylko na sąsiednie pola po liniach planszy.</li>
          <li>Nie można wejść na pole zajęte przez drugą figurę.</li>
          <li>Mysz nie może wejść na pole z kotem, kot nie może wejść na pole z myszą.</li>
        </ul>
        <h2>Tryby gry:</h2>
        <ul>
          <li><strong>Graj na jednym komputerze:</strong> Obie role obsługiwane są lokalnie.</li>
          <li><strong>Graj z innymi:</strong> Gra online z innym graczem.</li>
          <li><strong>Graj z komputerem:</strong> Gra przeciwko AI.</li>
        </ul>
        <h2>Wygrana:</h2>
        <ul>
          <li><strong>Mysz:</strong> Jeśli wykona 15 ruchów bez złapania.</li>
          <li><strong>Kot:</strong> Jeśli zablokuje wszystkie ruchy myszy.</li>
        </ul>
        <h2 style={{ textAlign: 'center' }}>Powodzenia!</h2>
      </div>
  )
}