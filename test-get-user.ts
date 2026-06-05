import mongoose from 'mongoose';
import User from './src/models/User';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const users = await User.find({}).lean();
  console.log(users.map(u => ({ email: u.email, batch: (u as any).batch })));
  process.exit(0);
}
run();
