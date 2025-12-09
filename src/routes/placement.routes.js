import express from 'express'
import { requireAuth, requireRole } from '../middlewares/auth.js'
import { addPlacement, listPlacements } from '../controllers/placement.controller.js'

export const router = express.Router()

router.get('/', listPlacements)
router.post('/', requireAuth, requireRole('staff', 'admin'), addPlacement)
