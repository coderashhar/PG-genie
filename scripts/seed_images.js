const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://ashharkhan:e652PTfPIFFUqKKd@pggenie.ciimwiz.mongodb.net/PGgenieDB?retryWrites=true&w=majority&appName=PGgenie';

const fallbackImages = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", // 1
  "https://images.unsplash.com/photo-1502672260266-1c1de2d9d00c?w=800&q=80", // 2
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", // 3
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", // 4
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"  // 5
];

async function seedImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create a generic schema to update properties
    const Property = mongoose.models.Property || mongoose.model('Property', new mongoose.Schema({}, { strict: false }));

    const properties = await Property.find({});
    console.log(`Found ${properties.length} properties.`);

    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      // Distribute image counts: 1, 2, 3, 4, 5, 1, 2, 3...
      const imageCount = (i % 5) + 1; 
      
      const imagesToSet = fallbackImages.slice(0, imageCount);
      
      await Property.updateOne({ _id: property._id }, { $set: { images: imagesToSet } });
      console.log(`Updated property "${property.title}" with ${imageCount} images.`);
    }

    console.log('Successfully updated all properties!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding images:', error);
    process.exit(1);
  }
}

seedImages();
