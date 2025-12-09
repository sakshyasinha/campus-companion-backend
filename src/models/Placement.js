import mongoose from 'mongoose'

const placementSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  package: { type: Number },
  batchYear: { type: Number },
  notes: { type: String },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

export const Placement = mongoose.model('Placement', placementSchema)
