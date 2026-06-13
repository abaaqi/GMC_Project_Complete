import { Router } from 'express'
import { ask } from '../controllers/assistantController.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.post('/', protect, ask)
export default router
