import mongoose from 'mongoose'

/** Connect to MongoDB. Resolves once the connection is open. */
export async function connectDB(uri) {
  mongoose.set('strictQuery', true)
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  })
  console.log(`✓ MongoDB connected → ${conn.connection.host}/${conn.connection.name}`)

  mongoose.connection.on('error', (err) => console.error('MongoDB error:', err.message))
  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'))

  return conn
}
