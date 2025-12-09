import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connectDB } from './config/db.js'
import { router as authRouter } from './routes/auth.routes.js'
import { router as eventRouter } from './routes/event.routes.js'
import { router as lostFoundRouter } from './routes/lostfound.routes.js'
import { router as complaintRouter } from './routes/complaint.routes.js'
import { router as placementRouter } from './routes/placement.routes.js'
import { router as mlRouter } from './routes/ml.routes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRouter)
app.use('/api/events', eventRouter)
app.use('/api/lostfound', lostFoundRouter)
app.use('/api/complaints', complaintRouter)
app.use('/api/placements', placementRouter)
app.use('/api/ml', mlRouter)

const PORT = process.env.PORT || 3000

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err)
    process.exit(1)
  })
