import { verifyToken } from '../utils/token.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import User from '../models/User.js'

/**
 * Protect routes: require a valid JWT, read from the httpOnly session
 * cookie or an "Authorization: Bearer <token>" header, then attach the
 * user to req.user.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token
  if (req.cookies?.token) {
    token = req.cookies.token
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) throw ApiError.unauthorized('Please log in to access this resource')

  let decoded
  try {
    decoded = verifyToken(token)
  } catch {
    throw ApiError.unauthorized('Your session is invalid or has expired')
  }

  const user = await User.findById(decoded.id)
  if (!user) throw ApiError.unauthorized('This account no longer exists')

  req.user = user
  next()
})

/** Restrict a route to specific roles (use after `protect`). */
export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw ApiError.forbidden('You do not have permission to perform this action')
  }
  next()
}
