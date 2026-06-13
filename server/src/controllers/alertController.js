import Alert from '../models/Alert.js'
import { crudFactory } from '../utils/crudFactory.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { timeAgo } from '../utils/timeAgo.js'

const base = crudFactory(Alert, 'Alert')

// Override list to add a human-friendly relative "time" the UI can show directly.
const list = asyncHandler(async (req, res) => {
  const docs = await Alert.find({ farm: req.user.farm }).sort('-createdAt')
  res.json(docs.map((d) => ({ ...d.toObject(), time: timeAgo(d.createdAt) })))
})

export default { ...base, list }
