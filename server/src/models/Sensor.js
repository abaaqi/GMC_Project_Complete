import mongoose from 'mongoose'

const sensorSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
    label: { type: String, required: [true, 'Sensor label is required'] },
    value: { type: Number, required: true },
    unit: { type: String, default: '' },
    status: { type: String, enum: ['healthy', 'warn', 'alert'], default: 'healthy' },
    icon: { type: String, default: 'gauge' },
    zone: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Sensor', sensorSchema)
