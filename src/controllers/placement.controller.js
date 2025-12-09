import { Placement } from '../models/Placement.js'

export async function addPlacement (req, res) {
  const { company, role, package: pkg, batchYear, notes } = req.body
  if (!company || !role) return res.status(400).json({ error: 'Missing fields' })
  const placement = await Placement.create({ company, role, package: pkg, batchYear, notes, addedBy: req.user?.id })
  res.status(201).json(placement)
}

export async function listPlacements (req, res) {
  const placements = await Placement.find().sort({ createdAt: -1 })
  res.json(placements)
}
