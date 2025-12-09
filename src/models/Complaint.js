import mongoose from 'mongoose'

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  status: { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

export const Complaint = mongoose.model('Complaint', complaintSchema)
