import { Router } from 'express'
import { listScans, createScan } from '../controllers/scanController.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.use(protect)
router.route('/').get(listScans).post(createScan)
export default router
