require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    // Define simple model just to see if we can query
    const Property = mongoose.models.Property || mongoose.model('Property', new mongoose.Schema({}, { strict: false }));
    const properties = await Property.find({ status: 'active' }).limit(1);
    console.log('Fetched properties successfully:', properties.length);
    process.exit(0);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}

test();
