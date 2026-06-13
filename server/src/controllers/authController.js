import mongoose from 'mongoose'
import User from '../models/User.js'
import Farm from '../models/Farm.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import { signToken, cookieOptions } from '../utils/token.js'

/** Shape a user document for the client (never leak the password). */
function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    farm: user.farm,
  }
}

/** Sign a token, set the session cookie, and return the auth payload. */
function sendAuth(res, status, user, farm) {
  const token = signToken(user._id)
  res.cookie('token', token, cookieOptions())
  res.status(status).json({ token, user: publicUser(user), farm: farm || null })
}

/**
 * POST /api/auth/register
 * Creates a user and their farm, links them, and starts a session.
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, farmName } = req.body

  const exists = await User.findOne({ email })
  if (exists) throw ApiError.conflict('An account with that email already exists')

  // Create the user first so the farm can reference it as owner.
  const user = await User.create({ name, email, password })

  let farm
  try {
    farm = await Farm.create({
      name: farmName || `${name}'s Farm`,
      owner: user._id,
      zones: 1,
    })
    user.farm = farm._id
    await user.save()
  } catch (err) {
    // Roll back the user if farm creation fails, so we don't orphan it.
    await User.findByIdAndDelete(user._id)
    throw err
  }

  sendAuth(res, 201, user, farm)
})

/**
 * POST /api/auth/login
 * Verifies credentials and starts a session.
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.matchPassword(password))) {
    throw ApiError.unauthorized('Invalid email or password')
  }

  const farm = user.farm ? await Farm.findById(user.farm) : null
  sendAuth(res, 200, user, farm)
})

/**
 * POST /api/auth/logout
 * Clears the session cookie.
 */
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', { ...cookieOptions(), maxAge: 0 })
  res.json({ success: true, message: 'Logged out' })
})

/**
 * GET /api/auth/me
 * Returns the currently authenticated user and their farm.
 */
export const getMe = asyncHandler(async (req, res) => {
  const farm = req.user.farm ? await Farm.findById(req.user.farm) : null
  res.json({ user: publicUser(req.user), farm })
})

/**
 * PATCH /api/auth/farm
 * Updates the authenticated user's farm profile.
 */
export const updateFarm = asyncHandler(async (req, res) => {
  if (!req.user.farm) throw ApiError.notFound('No farm linked to this account')
  const allowed = ['name', 'location', 'area', 'areaUnit', 'established', 'zones', 'waterSavedWeek']
  const updates = {}
  for (const key of allowed) if (key in req.body) updates[key] = req.body[key]

  const farm = await Farm.findOneAndUpdate(
    { _id: req.user.farm, owner: req.user._id },
    updates,
    { new: true, runValidators: true }
  )
  if (!farm) throw ApiError.notFound('Farm not found')
  res.json(farm)
})
