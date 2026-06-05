const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const User = require('./src/models/User').default;

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findOne({ email: 'aryan@vitstudent.ac.in' }).lean();
  console.log(user);
  process.exit(0);
}
run();
