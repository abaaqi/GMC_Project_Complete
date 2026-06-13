import Field from '../models/Field.js'
import Sensor from '../models/Sensor.js'
import Alert from '../models/Alert.js'
import Task from '../models/Task.js'
import Farm from '../models/Farm.js'
import Reading from '../models/Reading.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { timeAgo } from '../utils/timeAgo.js'

const avg = (arr, key) =>
  arr.length ? Math.round(arr.reduce((sum, x) => sum + (x[key] || 0), 0) / arr.length) : 0

/**
 * GET /api/dashboard/summary
 * Aggregates everything the overview page needs in one response:
 * KPIs (computed from live data), sensors, chart series, alerts,
 * the automation schedule, and the fields needing attention.
 */
export const getSummary = asyncHandler(async (req, res) => {
  const farmId = req.user.farm

  const [farm, fields, sensors, alerts, tasks, readings] = await Promise.all([
    Farm.findById(farmId),
    Field.find({ farm: farmId }).sort('-createdAt'),
    Sensor.find({ farm: farmId }),
    Alert.find({ farm: farmId }).sort('-createdAt'),
    Task.find({ farm: farmId }),
    Reading.find({ farm: farmId }),
  ])

  const avgMoisture = avg(fields, 'moisture')
  const avgHealth = avg(fields, 'health')
  const openAlerts = alerts.filter((a) => !a.resolved && a.severity !== 'info').length

  const kpis = [
    { id: 'moisture', label: 'Avg soil moisture', value: avgMoisture, unit: '%', trend: +4.2, status: avgMoisture >= 55 ? 'healthy' : 'warn', hint: 'Optimal band 55–70%' },
    { id: 'water', label: 'Water saved this week', value: farm?.waterSavedWeek || 0, unit: 'L', trend: +11.8, status: 'healthy', hint: 'vs. manual schedule' },
    { id: 'health', label: 'Crop health index', value: avgHealth, unit: '/100', trend: +1.6, status: avgHealth >= 80 ? 'healthy' : 'warn', hint: 'AI vision across zones' },
    { id: 'alerts', label: 'Open alerts', value: openAlerts, unit: '', trend: -2, status: openAlerts > 2 ? 'warn' : 'healthy', hint: 'needs attention' },
  ]

  const moistureSeries = readings.find((r) => r.kind === 'moisture24h')?.series || []
  const waterSeries = readings.find((r) => r.kind === 'waterWeek')?.series || []

  res.json({
    farm,
    kpis,
    sensors,
    moistureSeries,
    waterSeries,
    alerts: alerts.map((a) => ({ ...a.toObject(), time: timeAgo(a.createdAt) })),
    schedule: tasks,
    attention: fields.filter((f) => f.status !== 'healthy'),
  })
})
