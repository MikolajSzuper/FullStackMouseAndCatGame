const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.json())

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/cat_and_mouse'

mongoose.connect(mongoUrl).then(() => {
  console.log('Połączono z MongoDB:', mongoUrl)
}).catch(err => {
  console.error('Błąd połączenia z MongoDB:', err)
})

const logger = require('./middleware/logger')
app.use(logger)

const roomRoutes = require('./routes/roomRoutes')
const userRoutes = require('./routes/userRoutes')
const authMiddleware = require('./middleware/authMiddleware')

app.use('/api/rooms', authMiddleware, roomRoutes)
app.use('/api', userRoutes)

app.listen(5000, () => console.log('Serwer działa na http://localhost:5000'))