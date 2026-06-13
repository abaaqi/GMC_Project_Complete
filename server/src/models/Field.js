import mongoose from 'mongoose'

const fieldSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
    name: { type: String, required: [true, 'Field name is required'], trim: true },
    crop: { type: String, required: [true, 'Crop is required'], trim: true },
    variety: { type: String, default: '' },
    stage: { type: String, default: '' },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    health: { type: Number, min: 0, max: 100, default: 100 },
    moisture: { type: Number, min: 0, max: 100, default: 0 },
    plantedOn: { type: Date },
    nextAction: { type: String, default: '' },
    status: { type: String, enum: ['healthy', 'warn', 'alert'], default: 'healthy' },
  },
  { timestamps: true }
)

export default mongoose.model('Field', fieldSchema)
