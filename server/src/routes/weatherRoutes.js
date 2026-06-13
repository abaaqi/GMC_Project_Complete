import { Router } from 'express'
import { getWeather } from '../controllers/weatherController.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.get('/', protect, getWeather)
export default router
