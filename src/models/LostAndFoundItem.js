import mongoose from 'mongoose'

const lostAndFoundSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  foundDate: { type: Date },
  status: { type: String, enum: ['lost', 'found', 'returned'], default: 'lost' },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

export const LostAndFoundItem = mongoose.model('LostAndFoundItem', lostAndFoundSchema)
