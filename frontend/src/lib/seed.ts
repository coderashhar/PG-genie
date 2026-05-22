/**
 * Database Seed Script
 * Populates MongoDB with realistic fake data for development.
 * 
 * Run: npx tsx src/lib/seed.ts
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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

// --- Seed Data ---

const MONGODB_URI =
  'mongodb+srv://ashharkhan:e652PTfPIFFUqKKd@pggenie.ciimwiz.mongodb.net/PGgenieDB?retryWrites=true&w=majority&appName=PGgenie';

const PG_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAwRCscT_RSHrWh37dWQgDImnpm4gqzEA8vb6OP6nWaX6lrifReLCpTTGwDdbrwI0dUSBatLL03qx_Dxe_xUzrrGQ0Hg65bgdahXprFX-2X6Pn-kChn7DpLyDJeOuYNnsW-TYkFngLpmP-UVQxcPHmszejrBtDF2U6KUHITpzEjhraY6aw6vWljTj_hpQWh2R5UtDXFBpIZ2q5uZeRj5UlXuZA8ordx-0TtOXXTZhDbbMNNTX6XAbzLOZIi7hyTKU_TgA8i24akBzVc',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD7vNiqW4BascszDw9GIhPJsqgINESp787lbHCZgrmMxdBwHbXIymSqvwSgklKRjsbFqHkzi7xr7AN_FKH9AfWavz79urmqHLqBj1ppj3vaS_q0bIzig29J8wAWSxb4xXL18OwDEIf7VLY3va7d-dr5WVwpnUmULYXv6B9uKu4g3-6sCJQkcNEI0crOp2xavKAnxOe0HLhiUL9KylgwfEpcYU-HdtAQ71gLeQ7yYUy_WIBMVENFKr-PLohycnRv24uoWTw4aQI7M5aJ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCR6jZKxmsR55IQXDw4gtdv9rwAWdT8xnDWPHLhTy3kI8LLHJ_Yfg5hINAYpqoUY8_4upKiV9MLsch2vKFHPcnFxFyEZ_qc1MWrqpzlmjQ7dr2v0xsVbNMb47rZ7kUkt4Sof6_XeEVIFJQCUSUQ354m7_QT7Hmkz7Vvfn1ULCjfh0-M9eBEMTs4hFX8xZx3xHU2n22Ex0IKd9iiO1leoaes8uSbwF1hjj1Z2WI4snXiRefszrOmIKseYI5d4hJnucP2RT9KR_zFMfYW',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD9PDDOpUrPDk5UhB4RPpt-kmlZUoeRYzSRLUc0TUKV8kL2QvcF7SO8A0v1EuUdOa8EtrkXkVJED3Hi1HqZwB1JQQl9B04KNXTHQGF2eNaYscGlrNlxZCyYsNRg-FXzkK5sJg2RLCpaBH0smEBMt0fmqN7D97vbZ3sTkKq1aCFIVr54hncPZ45vGQlwUHwKqhyK5RjTTHXToFvHylTkfVrtV3d-rT9kF4M7M3Y4e4ZgvSEVryQKOndaypjmoda9svAkVCj7O3ODEViG',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD4439eyKIteT_JPudz1y3Wn86y_KUM_uHfQRTACJuO1WSjfdzGSnxZUEGsA3J6qicNibZ0yMdTdzf-ERmtX-eUQpoW_i-9ktzlbULGOC_z3BV28ZUI00IQvzVE5ZuZl2H2GnPZG_KiRHZMF6_o-sOei5Q_IMa5dSI1HPG8uOWdOg7DxeQq3E4p5FFm4_411hHiTYCy8U1z0wudbXwn_kAZ0T-KL2ixqUmvhMhqoVEPe6F_XfH4ah-RnCdgLy2WFyQC6Zvxm5yEXM-c',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAyy8VLRzVey67ryRRNXsVKfieMYQtUqfTzjc-dp8ZyE2aj-ISj8biKOeLHNbYfnSCk1JZ_ydxDrCE97-qR_1cfvwBhWX02rf4Lt2HbmP9ikgj9CyxAS4w9JvbIrNdKOCvy6ejLJM6Ki29FJThw9qBAJ4LjYupUlyjCgl_ay1hNzM7wQ8oRJ9cDVGEP-7SFQL3LCo4HenUOsLh46ZDjRQC95OO9OMyVhUp4KxqKR9a0Q_JoyWzW4DoTMkGBgeUMOJDl_jhuUoHitwHS',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDAZSDfXtpR0qfXkXu6uWXgFbb4rTlEuU_tVsCBVjvfOLiQiao1RJz8zNXHC1VJMqW-iYpQ-EKnnXtRlvTltQz1tSyqgegBOp3wy4Z1yKIpkCeEPYvKilj7K9ms-rI7uJj4lK_KcRnLjA5rVEwkqyc_AlrwNtI0IJ3hT_elLj2q4CSmUdLUOrrYntyg2ohnV6XvxLuac6uokU_ddtjLCd7-AWtCcsmS0Seq5uXbpeAZn_0Jl32xx8v7AnvTtZx58TxVsC2-hVwvebpk',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAzSJDZocQb0gKZVkHa20kfARAWN6ECs4m3RoxBT9Rx0FSXwIYD4WPtPL4yVC3KYXHdZw77dWUkWnFRbVvlkjyGtdpuvKIsoWuuAi-NbOjCKNzxgSiMOu1LFSBhl-FD2jtxPn9V9ngzROO23Ps9vasT__5f3qT3Ht4lO5lU5UNwQ1H0C3jhZGdRppAhwtKMe7M-TMVzZKRR4efJId_dcPCAqIDzUB7yW4puIhMXvMSHlet8vUfscdFf40KQKKUBgZTtjGvhGRvMDqya',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBOeQFEooVMV8xujdFXABWPVqGkKhAcXOQILSUTQIYMAiTF7iVMcsFiuwWEvfXMeqqkqYfN6b61ZhBPMLaLCpMzvZAifhUn9OuA-p9ARK1UUATKX-bGSWsPqDu7OLOhqvUm5l_CzUt26UW3l9-0z-7GU57SF61x7hmJQ913cxlK7EAPsRpaIwS2SL4x0jspuO6IGjV46jd8ZH9PYIyZnbtLcfKXUUIHtOWyL7mE0DlVkHZ4NunJ99MjQSuVF2HSgdOvOeFdnBFQTp93',
];

const OWNER_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAa6i3t63X_3Eaz-W-RdWzSWo5T-A9zZsL9lg81Swah_4fYUoTXodRfa2wbp2ZYgJN0ANnVSJn8Lw-FW4fijKfST2BjcLO6jJKnZOANjWWHX5LAHVQdtGCS--HVrjFf5XHLaYEhcSOo5axpH8huhk-jWu7_QJ-k9w3Y4scPvwfnyCytn00yA48mudilOsUorI1uw8yzK05Hepgi_ID6iMlsqv1gpLSshTrzJfc4mZCxg9mOHudlWHg0JsTzWsZ2xPKxJmhfFSeCuO3o';

async function seed() {
  console.log('🌱 Starting database seed...');

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Property.deleteMany({}),
    Booking.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // --- Create Owners ---
  const hashedPassword = await bcrypt.hash('password123', 10);

  const owner1 = await User.create({
    name: 'Sharma Ji',
    email: 'sharma@pggenie.com',
    password: hashedPassword,
    role: 'owner',
    phone: '+91 9876543210',
    image: OWNER_AVATAR,
    businessName: 'Sharma Properties',
    businessAddress: 'Main Market, Kothri, Bhopal',
  });

  const owner2 = await User.create({
    name: 'Gupta Ji',
    email: 'gupta@pggenie.com',
    password: hashedPassword,
    role: 'owner',
    phone: '+91 9876543211',
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
    phone: '+91 9988776655',
    university: 'VIT Bhopal',
    bio: 'CS undergrad looking for a comfortable PG near campus.',
    address: 'Mumbai, Maharashtra',
  });

  const student2 = await User.create({
    name: 'Priya Singh',
    email: 'priya@vitstudent.ac.in',
    password: hashedPassword,
    role: 'student',
    phone: '+91 9988776656',
    university: 'VIT Bhopal',
    bio: 'Engineering student, foodie, loves a quiet study environment.',
    address: 'Delhi, India',
  });

  const student3 = await User.create({
    name: 'Rahul Jain',
    email: 'rahul@vitstudent.ac.in',
    password: hashedPassword,
    role: 'student',
    phone: '+91 9988776657',
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
