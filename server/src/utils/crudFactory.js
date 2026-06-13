import ApiError from './ApiError.js'
import { asyncHandler } from './asyncHandler.js'

/**
 * Build a set of CRUD handlers for a Mongoose model, scoped to the
 * authenticated user's farm. Every document is read/written with a
 * `farm` filter so users only ever touch their own data.
 */
export function crudFactory(Model, label = 'Resource') {
  const list = asyncHandler(async (req, res) => {
    const docs = await Model.find({ farm: req.user.farm }).sort('-createdAt')
    res.json(docs)
  })

  const getOne = asyncHandler(async (req, res) => {
    const doc = await Model.findOne({ _id: req.params.id, farm: req.user.farm })
    if (!doc) throw ApiError.notFound(`${label} not found`)
    res.json(doc)
  })

  const create = asyncHandler(async (req, res) => {
    const doc = await Model.create({ ...req.body, farm: req.user.farm })
    res.status(201).json(doc)
  })

  const update = asyncHandler(async (req, res) => {
    const doc = await Model.findOneAndUpdate(
      { _id: req.params.id, farm: req.user.farm },
      req.body,
      { new: true, runValidators: true }
    )
    if (!doc) throw ApiError.notFound(`${label} not found`)
    res.json(doc)
  })

  const remove = asyncHandler(async (req, res) => {
    const doc = await Model.findOneAndDelete({ _id: req.params.id, farm: req.user.farm })
    if (!doc) throw ApiError.notFound(`${label} not found`)
    res.json({ success: true, id: req.params.id })
  })

  return { list, getOne, create, update, remove }
}
