import express from 'express'
import { requireAuth, requireRole } from '../middlewares/auth.js'
import { predictAttendanceRisk } from '../controllers/ml.controller.js'

export const router = express.Router()

router.post('/attendance-risk', requireAuth, predictAttendanceRisk)

router.post('/complaint-category', requireAuth, async (req, res) => {
  const { title, description } = req.body
  const category = (title + ' ' + (description || '')).toLowerCase().includes('hostel') ? 'hostel' : 'general'
  res.json({ category, confidence: 0.6 })
})

router.post('/attendance-pattern', requireAuth, requireRole('staff', 'admin'), async (req, res) => {
  const { attendance } = req.body // array of dates or counts
  const pattern = Array.isArray(attendance) && attendance.length > 10 ? 'irregular' : 'normal'
  res.json({ pattern, details: { totalEntries: Array.isArray(attendance) ? attendance.length : 0 } })
})

router.get('/placement-summary', requireAuth, async (req, res) => {
  // Placeholder: summarize placements by company count
  res.json({ summary: 'Top companies: ABC, XYZ', stats: { total: 0 } })
})
