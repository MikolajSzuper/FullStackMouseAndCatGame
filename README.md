# 🐭 Kot i Mysz – Gra sieciowa

Aplikacja webowa do gry w "Kota i mysz" – tryb lokalny, multiplayer oraz przeciwko AI.  
Projekt oparty o **React + Vite** (frontend), **Express + MongoDB** (backend), gotowy do uruchomienia w Dockerze.

---

## 🖥️ Demo

- **Frontend:** http://localhost:80  
- **Backend API:** http://localhost:5000  
- **MongoDB:** localhost:27017

---

## 🚀 Szybki start (Docker Compose)

1. **Sklonuj repozytorium:**
   ```sh
   git clone https://github.com/MikolajSzuper/FullStackMouseAndCatGame.git
   cd FullStackMouseAndCatGame
   ```

2. **Uruchom całość:**
   ```sh
   docker-compose up --build
   ```

3. **Otwórz przeglądarkę:**  
   http://localhost

> **Uwaga:** Przy każdym uruchomieniu baza MongoDB jest inicjalizowana przykładowymi użytkownikami z pliku [`mongo-init.js`](mongo-init.js).

---

## 🧩 Struktura projektu

```
.
├── client/         # Frontend (React + Vite)
├── server/         # Backend (Express + MongoDB)
├── mongo-init.js   # Skrypt inicjalizujący użytkowników w MongoDB
├── docker-compose.yml
```

---

## 🛠️ Skrypty developerskie

### Frontend

```sh
cd client
npm install
npm run dev      # uruchom lokalnie na http://localhost:5173
npm run build    # buduje produkcyjną wersję
```

### Backend

```sh
cd server
npm install
node index.js    # uruchom backend lokalnie na http://localhost:5000
```

---

## 🐳 Uruchamianie w Dockerze

- **Budowanie i start:**  
  `docker-compose up --build`
- **Zatrzymanie i usunięcie kontenerów:**  
  `docker-compose down`

---

## 👤 Przykładowi użytkownicy

Po starcie dostępni są m.in.:
- Nazwa: `Jan` / Hasło: `test`
- Nazwa: `Robert` / Hasło: `test`
- oraz kilkudziesięciu innych testowych użytkowników z hasłem `test` (patrz [`mongo-init.js`](mongo-init.js))

---

**Autor:** [Mikołaj Szuper](https://github.com/MikolajSzuper)