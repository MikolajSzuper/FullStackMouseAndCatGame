const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const roomRoutes = require('./routes/roomRoutes')
const userRoutes = require('./routes/userRoutes')
const authMiddleware = require('./middleware/authMiddleware')

app.use('/api/rooms', authMiddleware, roomRoutes)
app.use('/api', userRoutes)

app.listen(5000, () => console.log('Serwer działa na http://localhost:5000'))