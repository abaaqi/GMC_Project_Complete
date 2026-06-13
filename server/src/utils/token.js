import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

/** Sign a JWT for a user id. */
export function signToken(userId) {
  return jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })
}

/** Verify a JWT and return its decoded payload (throws if invalid/expired). */
export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret)
}

/** Options for the session cookie that carries the JWT. */
export function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSecure ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  }
}
