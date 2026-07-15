import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Get the URI from the environment variable we pass in the command line
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI is required.');
  process.exit(1);
}

async function run() {
  console.log('Connecting to production database...');
  await mongoose.connect(MONGODB_URI as string);
  console.log('✅ Connected.');

  const hashedPassword = await bcrypt.hash('OwnerTest123!', 10);
  const db = mongoose.connection.db;

  if (!db) {
    console.error('❌ No db connection');
    process.exit(1);
  }

  const result = await db.collection('users').updateMany(
    { email: { $in: ['sharma@pggenie.com', 'gupta@pggenie.com'] } },
    { $set: { password: hashedPassword } }
  );

  console.log(`✅ Updated ${result.modifiedCount} owner accounts to use password: OwnerTest123!`);
  
  await mongoose.disconnect();
  console.log('Disconnected from database.');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
