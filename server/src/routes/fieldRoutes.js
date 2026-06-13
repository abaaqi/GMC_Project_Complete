import { Router } from 'express'
import ctrl from '../controllers/fieldController.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.use(protect)
router.route('/').get(ctrl.list).post(ctrl.create)
router.route('/:id').get(ctrl.getOne).patch(ctrl.update).delete(ctrl.remove)
export default router
