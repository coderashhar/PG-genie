const mongoose = require('mongoose');

async function test() {
  try {
    await mongoose.connect('mongodb+srv://ashharkhan:e652PTfPIFFUqKKd@pggenie.ciimwiz.mongodb.net/PGgenieDB?retryWrites=true&w=majority&appName=PGgenie');
    console.log('Connected to DB successfully with seed password');
    process.exit(0);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}

test();
