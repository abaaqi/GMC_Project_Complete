import { validationResult } from 'express-validator'
import ApiError from '../utils/ApiError.js'

/** Collects express-validator results and throws a 400 if any failed. */
export function validate(req, res, next) {
  const result = validationResult(req)
  if (result.isEmpty()) return next()
  const details = result.array().map((e) => ({ field: e.path, message: e.msg }))
  throw ApiError.badRequest('Validation failed', details)
}
