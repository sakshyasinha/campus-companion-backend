import express from 'express'
import { requireAuth, requireRole } from '../middlewares/auth.js'
import { submitComplaint, listComplaints } from '../controllers/complaint.controller.js'

export const router = express.Router()

router.post('/', requireAuth, submitComplaint)
router.get('/', requireAuth, requireRole('staff', 'admin'), listComplaints)
