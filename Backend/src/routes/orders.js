const { Router } = require('express')
const fs = require('fs')
const path = require('path')
const router = Router()

const STORE = path.join(__dirname, '../storage/orders.json')

function readOrders() {
  try { return JSON.parse(fs.readFileSync(STORE, 'utf8')) } catch { return [] }
}
function writeOrders(data) {
  fs.mkdirSync(path.dirname(STORE), { recursive: true })
  fs.writeFileSync(STORE, JSON.stringify(data, null, 2))
}

router.get('/', (_req, res) => {
  res.json(readOrders())
})

router.post('/', (req, res) => {
  const orders = readOrders()
  const order = { id: 'ord_' + Date.now(), status: 'placed', createdAt: Date.now(), ...req.body }
  orders.unshift(order)
  writeOrders(orders)
  res.status(201).json(order)
})

router.patch('/:id', (req, res) => {
  const { id } = req.params
  const orders = readOrders()
  const idx = orders.findIndex((o) => o.id === id)
  if (idx < 0) return res.status(404).json({ error: 'not found' })
  orders[idx] = { ...orders[idx], ...req.body }
  writeOrders(orders)
  res.json(orders[idx])
})

module.exports = router







