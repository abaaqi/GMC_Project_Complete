import { Router } from 'express'
import authRoutes from './authRoutes.js'
import fieldRoutes from './fieldRoutes.js'
import sensorRoutes from './sensorRoutes.js'
import alertRoutes from './alertRoutes.js'
import productRoutes from './productRoutes.js'
import taskRoutes from './taskRoutes.js'
import scanRoutes from './scanRoutes.js'
import dashboardRoutes from './dashboardRoutes.js'
import weatherRoutes from './weatherRoutes.js'
import assistantRoutes from './assistantRoutes.js'

const router = Router()

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'mahafarm-api', time: new Date().toISOString() })
})

router.use('/auth', authRoutes)
router.use('/fields', fieldRoutes)
router.use('/sensors', sensorRoutes)
router.use('/alerts', alertRoutes)
router.use('/products', productRoutes)
router.use('/tasks', taskRoutes)
router.use('/scans', scanRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/weather', weatherRoutes)
router.use('/assistant', assistantRoutes)

export default router
