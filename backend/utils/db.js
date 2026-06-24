require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = async () => {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables')
  }

  const conn = await mongoose.connect(uri)
  console.log(`MongoDB connected: ${conn.connection.host}`)
  return conn
}

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected')
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err.message)
})

const disconnectDB = async () => {
  await mongoose.connection.close()
  console.log('MongoDB connection closed')
}

module.exports = { connectDB, disconnectDB }
