const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })

const authRoutes = require('./src/routes/auth')
const menuRoutes = require('./src/routes/menu')
const ordersRoutes = require('./src/routes/orders')

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'mana-ruchulu-backend', time: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/orders', ordersRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${PORT}`)
})





