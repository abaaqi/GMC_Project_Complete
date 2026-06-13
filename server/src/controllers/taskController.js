import Task from '../models/Task.js'
import { crudFactory } from '../utils/crudFactory.js'

export default crudFactory(Task, 'Task')
