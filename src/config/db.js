import mongoose from 'mongoose'

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export async function connectDB () {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campus_companion'
  const maxRetries = 10
  const delayMs = 1000
  mongoose.set('strictQuery', true)
  let attempt = 0
  while (attempt < maxRetries) {
    try {
      await mongoose.connect(uri, { autoIndex: true })
      console.log(`MongoDB connected: ${uri}`)
      return
    } catch (err) {
      attempt++
      console.error(`MongoDB connection failed (attempt ${attempt}/${maxRetries}):`, err.message)
      if (attempt >= maxRetries) throw err
      await sleep(delayMs)
    }
  }
}
