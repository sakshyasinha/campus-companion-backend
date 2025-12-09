import express from 'express'
import { requireAuth, requireRole } from '../middlewares/auth.js'
import { listEvents, createEvent, updateEvent, deleteEvent } from '../controllers/event.controller.js'

export const router = express.Router()

router.get('/', listEvents)
router.post('/', requireAuth, requireRole('staff', 'admin'), createEvent)
router.put('/:id', requireAuth, requireRole('staff', 'admin'), updateEvent)
router.delete('/:id', requireAuth, requireRole('admin'), deleteEvent)
