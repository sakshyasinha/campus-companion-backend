import express from 'express'
import { requireAuth } from '../middlewares/auth.js'
import { listItems, addItem, updateStatus } from '../controllers/lostfound.controller.js'

export const router = express.Router()

router.get('/', listItems)
router.post('/', requireAuth, addItem)
router.patch('/:id/status', requireAuth, updateStatus)
