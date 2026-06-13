import { isProd } from '../config/env.js'

/** Central error handler — normalizes Mongoose, JWT, and app errors. */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Something went wrong'
  let details = err.details

  // Invalid Mongo ObjectId
  if (err.name === 'CastError') {
    statusCode = 400
    message = `Invalid value for "${err.path}": ${err.value}`
  }

  // Duplicate unique key (e.g. email already registered)
  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    message = `That ${field} is already in use`
  }

  // Mongoose schema validation
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = 'Validation failed'
    details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }))
  }

  if (statusCode >= 500) console.error('✖', err)

  res.status(statusCode).json({
    error: {
      message,
      ...(details ? { details } : {}),
      ...(isProd ? {} : { stack: err.stack }),
    },
  })
}
