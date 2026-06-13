import { Router } from 'express'
import { body } from 'express-validator'
import { register, login, logout, getMe, updateFarm } from '../controllers/authController.js'
import { validate } from '../middleware/validate.js'
import { protect } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('farmName').optional().trim(),
  ],
  validate,
  register
)

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
)

router.post('/logout', logout)
router.get('/me', protect, getMe)
router.patch('/farm', protect, updateFarm)

export default router
