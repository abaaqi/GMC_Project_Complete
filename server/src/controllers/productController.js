import Product from '../models/Product.js'
import { crudFactory } from '../utils/crudFactory.js'

export default crudFactory(Product, 'Product')
