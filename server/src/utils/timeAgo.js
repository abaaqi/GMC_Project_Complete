/** Format a date as a short relative string, e.g. "12 min ago". */
export function timeAgo(date) {
  const diffMs = Date.now() - new Date(date).getTime()
  const min = Math.round(diffMs / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min} min ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr} hr ago`
  const days = Math.round(hr / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}
