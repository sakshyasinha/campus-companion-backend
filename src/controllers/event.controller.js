import { Event } from '../models/Event.js'

export async function listEvents (req, res) {
  const events = await Event.find().sort({ date: 1 })
  res.json(events)
}

export async function createEvent (req, res) {
  const { title, description, date, location } = req.body
  if (!title || !date) return res.status(400).json({ error: 'Missing fields' })
  const event = await Event.create({ title, description, date, location, createdBy: req.user?.id })
  res.status(201).json(event)
}

export async function updateEvent (req, res) {
  const { id } = req.params
  const updated = await Event.findByIdAndUpdate(id, req.body, { new: true })
  if (!updated) return res.status(404).json({ error: 'Not found' })
  res.json(updated)
}

export async function deleteEvent (req, res) {
  const { id } = req.params
  const deleted = await Event.findByIdAndDelete(id)
  if (!deleted) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
}
