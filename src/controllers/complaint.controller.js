import { Complaint } from '../models/Complaint.js'

export async function submitComplaint (req, res) {
  const { title, description, category } = req.body
  if (!title) return res.status(400).json({ error: 'Missing title' })
  const comp = await Complaint.create({ title, description, category, submittedBy: req.user?.id })
  res.status(201).json(comp)
}

export async function listComplaints (req, res) {
  const comps = await Complaint.find().sort({ createdAt: -1 })
  res.json(comps)
}
