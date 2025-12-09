import { LostAndFoundItem } from '../models/LostAndFoundItem.js'

export async function listItems (req, res) {
  const items = await LostAndFoundItem.find().sort({ createdAt: -1 })
  res.json(items)
}

export async function addItem (req, res) {
  const { title, description, foundDate, status } = req.body
  if (!title) return res.status(400).json({ error: 'Missing title' })
  const item = await LostAndFoundItem.create({ title, description, foundDate, status, reporter: req.user?.id })
  res.status(201).json(item)
}

export async function updateStatus (req, res) {
  const { id } = req.params
  const { status } = req.body
  const updated = await LostAndFoundItem.findByIdAndUpdate(id, { status }, { new: true })
  if (!updated) return res.status(404).json({ error: 'Not found' })
  res.json(updated)
}
