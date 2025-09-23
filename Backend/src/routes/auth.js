const { Router } = require('express')
const router = Router()
const fs = require('fs')
const path = require('path')

const OTP_STORE = path.join(__dirname, '../storage/otps.json')
function readOtps() {
  try { return JSON.parse(fs.readFileSync(OTP_STORE, 'utf8')) } catch { return [] }
}
function writeOtps(data) {
  fs.mkdirSync(path.dirname(OTP_STORE), { recursive: true })
  fs.writeFileSync(OTP_STORE, JSON.stringify(data, null, 2))
}

// NOTE: Placeholder auth to integrate later with Firebase/JWT
const USERS_STORE = path.join(__dirname, '../storage/users.json')
function readUsers() { try { return JSON.parse(fs.readFileSync(USERS_STORE, 'utf8')) } catch { return [] } }
function writeUsers(data) { fs.mkdirSync(path.dirname(USERS_STORE), { recursive: true }); fs.writeFileSync(USERS_STORE, JSON.stringify(data, null, 2)) }
const crypto = require('crypto')
function hashPassword(pw, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(pw, salt, 10000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}
function verifyPassword(pw, stored) {
  const [salt, hash] = String(stored).split(':')
  const calc = crypto.pbkdf2Sync(pw, salt, 10000, 64, 'sha512').toString('hex')
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(calc))
}

router.post('/signup', (req, res) => {
  const { email, name, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })
  const users = readUsers()
  if (users.find((u) => u.email.toLowerCase() === String(email).toLowerCase())) return res.status(409).json({ error: 'email already exists' })
  const id = 'u_' + Date.now()
  const user = { id, email, name: name || '', password: hashPassword(password), emailVerified: true, createdAt: Date.now() }
  users.push(user)
  writeUsers(users)
  return res.status(201).json({ ok: true, user: { id, email, name: user.name, emailVerified: true } })
})

router.post('/login', (req, res) => {
  const { email, password } = req.body || {}
  if (!email) return res.status(400).json({ error: 'email required' })
  const users = readUsers()
  const user = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase())
  if (!user) return res.status(401).json({ error: 'invalid credentials' })
  if (password) {
    if (!verifyPassword(password, user.password)) return res.status(401).json({ error: 'invalid credentials' })
  }
  return res.json({ ok: true, token: 'mock-token', user: { id: user.id, email: user.email, name: user.name } })
})

module.exports = router

// OTP login (dev-friendly)
router.post('/request-otp', (req, res) => {
  const { email } = req.body || {}
  if (!email) return res.status(400).json({ error: 'email required' })
  const otps = readOtps()
  const code = process.env.FIXED_OTP || '123456' // fixed for dev; replace with random in prod
  const expiresAt = Date.now() + 10 * 60 * 1000
  const existingIdx = otps.findIndex((o) => o.email === email)
  const rec = { email, code, expiresAt }
  if (existingIdx >= 0) otps[existingIdx] = rec; else otps.push(rec)
  writeOtps(otps)
  // In real apps send via email/SMS. Here we log for development.
  // eslint-disable-next-line no-console
  console.log(`[AUTH] OTP for ${email}: ${code} (expires in 10m)`) 
  const payload = { ok: true }
  if (process.env.NODE_ENV !== 'production') payload.devCode = code
  return res.json(payload)
})

router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body || {}
  if (!email || !otp) return res.status(400).json({ error: 'email and otp required' })
  const otps = readOtps()
  const idx = otps.findIndex((o) => o.email === email)
  if (idx < 0) return res.status(400).json({ error: 'otp not requested' })
  const rec = otps[idx]
  if (rec.expiresAt < Date.now()) return res.status(400).json({ error: 'otp expired' })
  if (String(rec.code) !== String(otp)) return res.status(400).json({ error: 'invalid otp' })
  otps.splice(idx, 1)
  writeOtps(otps)
  return res.json({ ok: true, token: 'mock-token', user: { id: 'u_' + Date.now(), email } })
})


