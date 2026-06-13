import mongoose from 'mongoose'

/**
 * A stored analytics snapshot for the dashboard charts.
 *  - kind "moisture24h": soil moisture per zone over the last 24h
 *  - kind "waterWeek":   automated vs. baseline water use this week
 * The flexible `series` array holds the chart-ready data points.
 */
const readingSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
    kind: { type: String, enum: ['moisture24h', 'waterWeek'], required: true },
    series: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
)

readingSchema.index({ farm: 1, kind: 1 }, { unique: true })

export default mongoose.model('Reading', readingSchema)
