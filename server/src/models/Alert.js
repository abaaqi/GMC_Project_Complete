import mongoose from 'mongoose'

const alertSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
    severity: { type: String, enum: ['alert', 'warn', 'info'], default: 'info' },
    title: { type: String, required: [true, 'Alert title is required'] },
    body: { type: String, default: '' },
    zone: { type: String, default: '' },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Alert', alertSchema)
