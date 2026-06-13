import mongoose from 'mongoose'

// An automated (or manual) job on the farm's schedule.
const taskSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
    time: { type: String, default: '' }, // e.g. "14:30"
    label: { type: String, required: [true, 'Task label is required'] },
    kind: { type: String, enum: ['water', 'nutrient', 'scan'], default: 'water' },
    auto: { type: Boolean, default: true },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Task', taskSchema)
