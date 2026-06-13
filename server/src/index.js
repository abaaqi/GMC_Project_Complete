import app from './app.js'
import { env } from './config/env.js'
import { connectDB } from './config/db.js'

/*
 * Startup order matters for cloud platforms (Render, Railway, Fly, etc.):
 * they wait for the process to bind a port on 0.0.0.0 and mark the deploy
 * failed if it doesn't ("No open ports detected"). So we OPEN THE PORT FIRST,
 * then connect to MongoDB. A database problem is logged and retried instead of
 * crashing the process, which keeps the port open and the real error visible.
 */

// 1) Bind the port immediately. Host 0.0.0.0 = listen on all interfaces
//    (required by container/cloud port scanners). PORT is injected by the host.
const server = app.listen(env.port, '0.0.0.0', () => {
  console.log(`✓ MahaFarm API listening on 0.0.0.0:${env.port} (${env.nodeEnv})`)
  console.log(`  Health check: /api/health`)
})

// 2) Connect to MongoDB with a few retries; never exit on failure here.
async function initDb(retriesLeft = 5) {
  try {
    await connectDB(env.mongoUri)
  } catch (err) {
    console.error(`✖ MongoDB connection failed: ${err.message}`)
    if (retriesLeft > 0) {
      console.error(`  Retrying in 5s… (${retriesLeft} attempt(s) left)`)
      setTimeout(() => initDb(retriesLeft - 1), 5000)
    } else {
      console.error(
        '  Out of retries. Check MONGODB_URI and that your database allows connections ' +
          'from this host (e.g. Atlas Network Access → 0.0.0.0/0).'
      )
    }
  }
}
initDb()

// 3) Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n${signal} received — shutting down…`)
  server.close(() => process.exit(0))
  // Force-exit if connections linger.
  setTimeout(() => process.exit(0), 10000).unref()
}
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

// Log unhandled rejections, but do NOT tear down the server over them.
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err)
})
