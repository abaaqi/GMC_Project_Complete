import mongoose from 'mongoose'

const farmSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Farm name is required'], trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, default: '' },
    area: { type: Number, default: 0 },
    areaUnit: { type: String, default: 'acres' },
    established: { type: Number },
    zones: { type: Number, default: 1 },
    // Stored aggregate used by the dashboard KPI cards.
    waterSavedWeek: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Farm', farmSchema)
