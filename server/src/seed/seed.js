/* ============================================================
   MahaFarm — database seeder
     node src/seed/seed.js            seed the demo farm
     node src/seed/seed.js --destroy  wipe all collections
   ============================================================ */
import { connectDB } from '../config/db.js'
import { env } from '../config/env.js'
import mongoose from 'mongoose'

import User from '../models/User.js'
import Farm from '../models/Farm.js'
import Field from '../models/Field.js'
import Sensor from '../models/Sensor.js'
import Alert from '../models/Alert.js'
import Product from '../models/Product.js'
import Task from '../models/Task.js'
import Scan from '../models/Scan.js'
import Reading from '../models/Reading.js'

import * as data from './data.js'

const MODELS = [User, Farm, Field, Sensor, Alert, Product, Task, Scan, Reading]

async function wipe() {
  await Promise.all(MODELS.map((M) => M.deleteMany({})))
  console.log('✓ Cleared all collections')
}

async function seed() {
  await wipe()

  // 1) Demo user (password is hashed by the User pre-save hook)
  const user = await User.create(data.demoUser)

  // 2) Their farm, linked back to the user
  const farm = await Farm.create({ ...data.demoFarm, owner: user._id })
  user.farm = farm._id
  await user.save()

  const withFarm = (arr) => arr.map((x) => ({ ...x, farm: farm._id }))

  // 3) Farm resources
  await Field.insertMany(withFarm(data.fields))
  await Sensor.insertMany(withFarm(data.sensors))
  await Product.insertMany(withFarm(data.products))
  await Task.insertMany(withFarm(data.tasks))
  await Reading.insertMany(withFarm(data.readings))

  // 4) Alerts — set a realistic createdAt from each item's agoMin
  for (const a of data.alerts) {
    const { agoMin, ...rest } = a
    const doc = await Alert.create({ ...rest, farm: farm._id })
    await Alert.updateOne(
      { _id: doc._id },
      { $set: { createdAt: new Date(Date.now() - agoMin * 60000) } },
      { timestamps: false }
    )
  }

  console.log('✓ Seeded demo farm and resources')
  console.log('\n  Demo login')
  console.log(`  ├─ email:    ${data.demoUser.email}`)
  console.log(`  └─ password: ${data.demoUser.password}\n`)
}

async function run() {
  const destroy = process.argv.includes('--destroy')
  try {
    await connectDB(env.mongoUri)
    if (destroy) {
      await wipe()
      console.log('✓ Database emptied')
    } else {
      await seed()
    }
  } catch (err) {
    console.error('✖ Seed failed:', err)
    process.exitCode = 1
  } finally {
    await mongoose.connection.close()
    process.exit()
  }
}

run()
