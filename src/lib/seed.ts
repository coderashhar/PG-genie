/**
 * Database Seed Script
 * Populates MongoDB with realistic fake data for development.
 * 
 * Run: npx tsx src/lib/seed.ts
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// --- Inline model definitions to avoid Next.js import issues ---

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    image: { type: String },
    role: { type: String, enum: ['student', 'owner'], default: 'student' },
    phone: { type: String },
    university: { type: String, trim: true },
    bio: { type: String, maxlength: 500, trim: true },
    address: { type: String, trim: true },
    businessName: { type: String, trim: true },
    businessAddress: { type: String, trim: true },
    savedPgs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  },
  { timestamps: true }
);

const PropertySchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String },
    },
    price: { type: Number, required: true },
    roomTypes: [{ type: String }],
    amenities: [{ type: String }],
    images: [{ type: String }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    views: { type: Number, default: 0 },
    monthlyViews: [
      {
        month: { type: Number, required: true },
        year: { type: Number, required: true },
        count: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

const BookingSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    message: { type: String },
    visitDate: { type: Date },
    visitTime: { type: String },
  },
  { timestamps: true }
);

// Get or create models
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);
const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['system', 'booking', 'message', 'offer'], default: 'system' },
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);
const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

// --- Seed Data ---

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

const PG_IMAGES = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1de2d9d00c?w=800&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
  'https://images.unsplash.com/photo-1583847268964-b28ce8fba1f3?w=800&q=80',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
];

const OWNER_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop';

async function seed() {
  console.log('🌱 Starting database seed...');

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Property.deleteMany({}),
    Booking.deleteMany({}),
    Notification.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // --- Create Owners ---
  const hashedPassword = await bcrypt.hash('password123', 10);

  const owner1 = await User.create({
    name: 'Sharma Ji',
    email: 'sharma@pggenie.com',
    password: hashedPassword,
    role: 'owner',
    phone: '+919876543210',
    image: OWNER_AVATAR,
    businessName: 'Sharma Properties',
    businessAddress: 'Main Market, Kothri, Bhopal',
  });

  const owner2 = await User.create({
    name: 'Gupta Ji',
    email: 'gupta@pggenie.com',
    password: hashedPassword,
    role: 'owner',
    phone: '+919876543211',
    businessName: 'Gupta Residences',
    businessAddress: 'Near VIT Gate, Kothri, Bhopal',
  });

  console.log('👤 Created 2 owners');

  // --- Create Students ---
  const student1 = await User.create({
    name: 'Aryan Patel',
    email: 'aryan@vitstudent.ac.in',
    password: hashedPassword,
    role: 'student',
    phone: '+919988776655',
    university: 'VIT Bhopal',
    bio: 'CS undergrad looking for a comfortable PG near campus.',
    address: 'Mumbai, Maharashtra',
  });

  const student2 = await User.create({
    name: 'Priya Singh',
    email: 'priya@vitstudent.ac.in',
    password: hashedPassword,
    role: 'student',
    phone: '+919988776656',
    university: 'VIT Bhopal',
    bio: 'Engineering student, foodie, loves a quiet study environment.',
    address: 'Delhi, India',
  });

  const student3 = await User.create({
    name: 'Rahul Jain',
    email: 'rahul@vitstudent.ac.in',
    password: hashedPassword,
    role: 'student',
    phone: '+919988776657',
    university: 'VIT Bhopal',
    bio: 'Second year mechanical student.',
    address: 'Jaipur, Rajasthan',
  });

  console.log('👤 Created 3 students');

  // --- Create Properties ---
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const properties = await Property.insertMany([
    {
      ownerId: owner1._id,
      title: 'Sunrise Student Housing',
      description:
        'Modern student accommodation with premium amenities. Spacious rooms with attached balcony, high-speed WiFi, AC, and 24/7 security. Just 1.2 km from VIT Bhopal campus.',
      location: { address: 'Near Main Gate, Kothri', city: 'Bhopal', state: 'Madhya Pradesh', zipCode: '462046' },
      price: 6500,
      roomTypes: ['Single', 'Double', 'Triple'],
      amenities: ['WiFi', 'AC', 'Laundry', 'Power Backup', 'CCTV'],
      images: [PG_IMAGES[0], PG_IMAGES[4]],
      status: 'active',
      views: 342,
      monthlyViews: [
        { month: lastMonth, year: lastMonthYear, count: 145 },
        { month: currentMonth, year: currentYear, count: 197 },
      ],
    },
    {
      ownerId: owner1._id,
      title: 'Kothri Boys Hostel',
      description:
        'Affordable boys hostel with homely meals and a welcoming atmosphere. Just 0.8 km from VIT Bhopal. Includes breakfast and dinner.',
      location: { address: 'Market Road, Kothri', city: 'Bhopal', state: 'Madhya Pradesh', zipCode: '462046' },
      price: 5000,
      roomTypes: ['Double', 'Triple'],
      amenities: ['WiFi', 'Meals', 'Power Backup'],
      images: [PG_IMAGES[1], PG_IMAGES[7]],
      status: 'active',
      views: 218,
      monthlyViews: [
        { month: lastMonth, year: lastMonthYear, count: 98 },
        { month: currentMonth, year: currentYear, count: 120 },
      ],
    },
    {
      ownerId: owner1._id,
      title: 'Elite Girls Premium PG',
      description:
        'Premium all-girls PG with laundry service, 3 meals/day, and dedicated study rooms. Safe, secure, and close to campus.',
      location: { address: 'Main Market, Kothri', city: 'Bhopal', state: 'Madhya Pradesh', zipCode: '462046' },
      price: 8000,
      roomTypes: ['Single', 'Double'],
      amenities: ['Laundry', 'Meals', 'Study Room', 'AC', 'WiFi'],
      images: [PG_IMAGES[8], PG_IMAGES[5]],
      status: 'active',
      views: 156,
      monthlyViews: [
        { month: lastMonth, year: lastMonthYear, count: 67 },
        { month: currentMonth, year: currentYear, count: 89 },
      ],
    },
    {
      ownerId: owner2._id,
      title: 'Green Valley Residency',
      description:
        'Peaceful living with lush green surroundings. Includes gym access, rooftop garden, and high-speed fiber internet. 1.5 km from VIT.',
      location: { address: 'Valley Road, Kothri', city: 'Bhopal', state: 'Madhya Pradesh', zipCode: '462046' },
      price: 7500,
      roomTypes: ['Single', 'Double'],
      amenities: ['WiFi', 'AC', 'Gym', 'Garden', 'Power Backup'],
      images: [PG_IMAGES[2], PG_IMAGES[6]],
      status: 'active',
      views: 289,
      monthlyViews: [
        { month: lastMonth, year: lastMonthYear, count: 112 },
        { month: currentMonth, year: currentYear, count: 177 },
      ],
    },
    {
      ownerId: owner2._id,
      title: 'Shanti Niwas',
      description:
        'Budget-friendly student PG with homely food. Clean rooms, attached bathrooms, and friendly staff. Walking distance from VIT campus.',
      location: { address: 'Temple Street, Kothri', city: 'Bhopal', state: 'Madhya Pradesh', zipCode: '462046' },
      price: 4500,
      roomTypes: ['Double', 'Triple'],
      amenities: ['Meals', 'Power Backup', 'Parking'],
      images: [PG_IMAGES[3], PG_IMAGES[1]],
      status: 'active',
      views: 178,
      monthlyViews: [
        { month: lastMonth, year: lastMonthYear, count: 83 },
        { month: currentMonth, year: currentYear, count: 95 },
      ],
    },
    {
      ownerId: owner2._id,
      title: 'Elite Co-living Spaces',
      description:
        'Experience premium student living with state-of-the-art facilities, dedicated study zones, and high-speed internet designed for modern academic needs.',
      location: { address: 'Premium Sector, Kothri', city: 'Bhopal', state: 'Madhya Pradesh', zipCode: '462046' },
      price: 11000,
      roomTypes: ['Single', 'Double'],
      amenities: ['Fiber Internet', 'Premium Meals', 'Central AC', 'Gym', 'Study Zone'],
      images: [PG_IMAGES[6], PG_IMAGES[4]],
      status: 'active',
      views: 412,
      monthlyViews: [
        { month: lastMonth, year: lastMonthYear, count: 156 },
        { month: currentMonth, year: currentYear, count: 256 },
      ],
    },
  ]);

  console.log('🏠 Created 6 properties');

  // --- Set saved PGs for students ---
  await User.findByIdAndUpdate(student1._id, {
    savedPgs: [properties[0]._id, properties[1]._id],
  });
  await User.findByIdAndUpdate(student2._id, {
    savedPgs: [properties[2]._id, properties[5]._id],
  });
  await User.findByIdAndUpdate(student3._id, {
    savedPgs: [properties[3]._id, properties[4]._id, properties[0]._id],
  });

  console.log('❤️  Set saved PGs for students');

  // --- Create Bookings ---
  const futureDate1 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days from now
  const futureDate2 = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days from now
  const pastDate1 = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
  const pastDate2 = new Date(now.getTime() - 17 * 24 * 60 * 60 * 1000); // 17 days ago

  await Booking.insertMany([
    {
      studentId: student1._id,
      pgId: properties[3]._id, // Green Valley
      ownerId: owner2._id,
      status: 'pending',
      message: 'Interested in a single room. Can I visit this week?',
      visitDate: futureDate1,
      visitTime: '4:00 PM',
      createdAt: pastDate1,
    },
    {
      studentId: student1._id,
      pgId: properties[4]._id, // Shanti Niwas
      ownerId: owner2._id,
      status: 'accepted',
      message: 'Looking for budget-friendly double sharing.',
      visitDate: pastDate2,
      visitTime: '11:00 AM',
      createdAt: pastDate2,
    },
    {
      studentId: student1._id,
      pgId: properties[0]._id, // Sunrise
      ownerId: owner1._id,
      status: 'pending',
      message: 'Would like to see the AC rooms.',
      visitDate: futureDate2,
      visitTime: '2:30 PM',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      studentId: student2._id,
      pgId: properties[2]._id, // Elite Girls
      ownerId: owner1._id,
      status: 'pending',
      message: 'Is there a single room available from next month?',
      visitDate: futureDate1,
      visitTime: '10:00 AM',
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      studentId: student3._id,
      pgId: properties[0]._id, // Sunrise
      ownerId: owner1._id,
      status: 'rejected',
      message: 'Need a triple sharing room.',
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      studentId: student3._id,
      pgId: properties[5]._id, // Elite Co-living
      ownerId: owner2._id,
      status: 'accepted',
      message: 'Very interested in premium facilities.',
      visitDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      visitTime: '3:00 PM',
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
  ]);

  console.log('📋 Created 6 bookings');

  // --- Create Notifications for Accepted/Rejected Bookings ---
  await Notification.insertMany([
    {
      user: student1._id,
      title: 'Booking Update',
      message: 'Your booking request has been accepted.',
      type: 'booking',
      link: '/dashboard',
      createdAt: pastDate2,
    },
    {
      user: student3._id,
      title: 'Booking Update',
      message: 'Your booking request has been rejected.',
      type: 'booking',
      link: '/dashboard',
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    },
    {
      user: student3._id,
      title: 'Booking Update',
      message: 'Your booking request has been accepted.',
      type: 'booking',
      link: '/dashboard',
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
  ]);

  console.log('🔔 Created 3 notifications');

  // --- Summary ---
  console.log('\n🎉 Seed complete! Summary:');
  console.log(`   Owners: ${await User.countDocuments({ role: 'owner' })}`);
  console.log(`   Students: ${await User.countDocuments({ role: 'student' })}`);
  console.log(`   Properties: ${await Property.countDocuments()}`);
  console.log(`   Bookings: ${await Booking.countDocuments()}`);

  console.log('\n📧 Test credentials:');
  console.log('   Student: aryan@vitstudent.ac.in / password123');
  console.log('   Student: priya@vitstudent.ac.in / password123');
  console.log('   Student: rahul@vitstudent.ac.in / password123');
  console.log('   Owner:   sharma@pggenie.com / password123');
  console.log('   Owner:   gupta@pggenie.com / password123');

  await mongoose.disconnect();
  console.log('\n✅ Disconnected from MongoDB');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
