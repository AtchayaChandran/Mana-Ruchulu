const { Router } = require('express')
const fs = require('fs')
const path = require('path')
const router = Router()

function readMenu() {
  try {
    const p = path.join(__dirname, '../storage/menu.json')
    const raw = fs.readFileSync(p, 'utf8')
    return JSON.parse(raw)
  } catch {
    return { categories: [] }
  }
}

router.get('/', (_req, res) => {
  const menu = readMenu()
  res.json(menu)
})

module.exports = router







