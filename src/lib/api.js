import { API_BASE_URL } from './config.js'

/* Mongo documents use `_id`; the Phase 1 UI expects `id`. Normalizing here
   means every page keeps using `.id` whether data is mock or live. */
function normalize(value) {
  if (Array.isArray(value)) return value.map(normalize)
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) out[k] = normalize(v)
    if (out._id && out.id === undefined) out.id = String(out._id)
    return out
  }
  return value
}

async function request(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: 'include', // send/receive the session cookie
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    const message = data?.error?.message || data?.message || `Request failed (${res.status})`
    const err = new Error(message)
    err.status = res.status
    err.details = data?.error?.details
    throw err
  }
  return normalize(data)
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' }),
}

/* Named auth helpers used by the auth context. */
export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}
