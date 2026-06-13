import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    grade: { type: String, default: 'A' },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    unit: { type: String, default: 'kg' },
    stock: { type: Number, default: 0, min: 0 },
    category: { type: String, enum: ['Fruit', 'Vegetable', 'Grain', 'Processed'], default: 'Vegetable' },
    seller: { type: String, default: '' },
    trend: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Product', productSchema)
