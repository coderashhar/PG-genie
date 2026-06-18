import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('Connected to DB');

  // Load actual models
  require('./src/models/Property');
  require('./src/models/User');
  require('./src/models/Booking');

  const Property = mongoose.model('Property');

  console.log('\n================================');
  console.log('PHASE 2: DATABASE PROFILING');
  console.log('================================\n');
  
  console.log('--- 1. /api/properties (Default List) ---');
  const startList = Date.now();
  const query = { status: 'active' }; 
  const listExplain = await Property.find(query).sort({ createdAt: -1 }).skip(0).limit(6).explain("executionStats");
  
  console.log(`Query Execution Time: ${listExplain[0]?.executionStats?.executionTimeMillis}ms`);
  console.log(`Total Docs Examined: ${listExplain[0]?.executionStats?.totalDocsExamined}`);
  console.log(`Index Used: ${listExplain[0]?.queryPlanner?.winningPlan?.stage === 'COLLSCAN' ? 'NO (Collection Scan)' : 'YES'}`);
  console.log(`Plan Details: ${JSON.stringify(listExplain[0]?.queryPlanner?.winningPlan)}`);

  console.log('\n--- 2. /api/properties (With Search Regex) ---');
  const searchQuery = { 
    status: 'active',
    $or: [
      { title: new RegExp('sunshine', 'i') },
      { description: new RegExp('sunshine', 'i') },
      { 'location.address': new RegExp('sunshine', 'i') }
    ]
  };
  const searchExplain = await Property.find(searchQuery).sort({ createdAt: -1 }).skip(0).limit(6).explain("executionStats");
  console.log(`Query Execution Time: ${searchExplain[0]?.executionStats?.executionTimeMillis}ms`);
  console.log(`Total Docs Examined: ${searchExplain[0]?.executionStats?.totalDocsExamined}`);
  console.log(`Index Used: ${searchExplain[0]?.queryPlanner?.winningPlan?.stage === 'COLLSCAN' ? 'NO (Collection Scan)' : 'YES'}`);

  console.log('\n--- 3. /api/properties countDocuments ---');
  const startCount = Date.now();
  await Property.countDocuments(query);
  console.log(`Count Execution Time: ${Date.now() - startCount}ms`);

  mongoose.disconnect();
}

run().catch(console.error);
