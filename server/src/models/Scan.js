import mongoose from 'mongoose'

// A disease-detection scan result (Phase 2 simulates the vision model).
const scanSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
    crop: { type: String, default: '' },
    disease: { type: String, required: true },
    pathogen: { type: String, default: '—' },
    confidence: { type: Number, min: 0, max: 100, default: 0 },
    severity: { type: String, enum: ['None', 'Low', 'Moderate', 'High'], default: 'None' },
    treatment: { type: String, default: '' },
    imageName: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Scan', scanSchema)
