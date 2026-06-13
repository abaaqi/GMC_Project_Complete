import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import { env, isProd } from './config/env.js'
import apiRoutes from './routes/index.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'
import { apiLimiter } from './middleware/rateLimiter.js'

const app = express()

// --- Security & parsing ---
app.use(helmet())
app.use(
  cors({
    origin: env.clientUrl, // allow the Phase 1 frontend
    credentials: true, // allow the session cookie
  })
)
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// --- Logging ---
app.use(morgan(isProd ? 'combined' : 'dev'))

// --- Root ---
app.get('/', (req, res) => {
  res.json({
    name: 'MahaFarm API',
    version: '1.0.0',
    docs: '/api/health',
  })
})

// --- API ---
app.use('/api', apiLimiter, apiRoutes)

// --- 404 + errors (must be last) ---
app.use(notFound)
app.use(errorHandler)

export default app
