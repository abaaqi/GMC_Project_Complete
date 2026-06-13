import Field from '../models/Field.js'
import { crudFactory } from '../utils/crudFactory.js'

// Full CRUD for fields, scoped to the authenticated user's farm.
export default crudFactory(Field, 'Field')
