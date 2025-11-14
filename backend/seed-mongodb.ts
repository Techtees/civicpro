import "dotenv/config";
import mongoose from "mongoose";
import { connectToDatabase } from "./db";
import {
  UserModel,
  PoliticianModel,
  PromiseModel,
  BillModel,
  VotingRecordModel,
  RatingModel,
  AdminLogModel
} from "../shared/mongodb-schema";

async function seedDatabase() {
  try {
    console.log("🌱 Starting MongoDB seed...");
    
    // Connect to database
    await connectToDatabase();
    
    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Promise.all([
      UserModel.deleteMany({}),
      PoliticianModel.deleteMany({}),
      PromiseModel.deleteMany({}),
      BillModel.deleteMany({}),
      VotingRecordModel.deleteMany({}),
      RatingModel.deleteMany({}),
      AdminLogModel.deleteMany({})
    ]);
    
    // Insert admin user
    console.log("👤 Creating admin user...");
    const adminUser = await UserModel.create({
      username: 'admin',
      password: 'admin123',
      isAdmin: true
    });
    
    // Insert politicians
    console.log("🏛️  Creating politicians...");
    const janeSmith = await PoliticianModel.create({
      name: 'Jane Smith',
      party: 'Democratic',
      parish: 'St. Peter Port',
      numberOfVotes: 15420,
      status: 'Current',
      bio: 'Jane Smith is a Democratic member representing St. Peter Port parish. She was first elected in 2018 and has focused her legislative efforts on environmental protection, healthcare reform, and economic equality.',
      firstElected: new Date('2018-11-06'),
      profileImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150',
      manifestoPoint1: 'Expand renewable energy investments by 25%',
      manifestoPoint2: 'Increase minimum wage to £12 per hour',
      manifestoPoint3: 'Expand healthcare coverage to all residents',
      manifestoPoint4: 'Reform education funding system',
      manifestoPoint5: 'Support local business development'
    });
    
    const johnDoe = await PoliticianModel.create({
      name: 'John Doe',
      party: 'Republican',
      parish: 'St. Sampson',
      numberOfVotes: 12380,
      status: 'Current',
      bio: 'John Doe is a Republican member representing St. Sampson parish. He focuses on defense, economic growth, and fiscal responsibility.',
      firstElected: new Date('2016-11-08'),
      profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150',
      manifestoPoint1: 'Strengthen border security measures',
      manifestoPoint2: 'Provide tax cuts for small businesses',
      manifestoPoint3: 'Increase defense spending by 15%',
      manifestoPoint4: 'Reduce government regulations',
      manifestoPoint5: 'Support traditional family values'
    });
    
    const mariaRodriguez = await PoliticianModel.create({
      name: 'Maria Rodriguez',
      party: 'Independent',
      parish: 'Vale',
      numberOfVotes: 9750,
      status: 'Current',
      bio: 'Maria Rodriguez is an Independent member representing Vale parish. She advocates for education reform, environmental policies, and social justice.',
      firstElected: new Date('2020-11-03'),
      profileImageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150',
      manifestoPoint1: 'Reform education system and teacher pay',
      manifestoPoint2: 'Implement comprehensive environmental policies',
      manifestoPoint3: 'Ensure social justice and equality',
      manifestoPoint4: 'Support community development programs',
      manifestoPoint5: 'Promote transparency in government'
    });
    
    const robertJohnson = await PoliticianModel.create({
      name: 'Robert Johnson',
      party: 'Democratic',
      parish: 'St. Martin',
      numberOfVotes: 11200,
      status: 'Current',
      bio: 'Robert Johnson is a Democratic member representing St. Martin parish. He focuses on urban development, healthcare access, and education.',
      firstElected: new Date('2018-11-06'),
      profileImageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150',
      manifestoPoint1: 'Improve public transportation system',
      manifestoPoint2: 'Expand healthcare access programs',
      manifestoPoint3: 'Increase education funding by 20%',
      manifestoPoint4: 'Support affordable housing initiatives',
      manifestoPoint5: 'Promote economic development'
    });
    
    const sarahWilliams = await PoliticianModel.create({
      name: 'Sarah Williams',
      party: 'Republican',
      parish: 'Forest',
      numberOfVotes: 8950,
      status: 'Current',
      bio: 'Sarah Williams is a Republican member representing Forest parish. She advocates for small business, economic growth, and community development.',
      firstElected: new Date('2020-11-03'),
      profileImageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150',
      manifestoPoint1: 'Support small business development',
      manifestoPoint2: 'Reduce business taxes and regulations',
      manifestoPoint3: 'Improve infrastructure and roads',
      manifestoPoint4: 'Strengthen community safety programs',
      manifestoPoint5: 'Promote tourism and heritage'
    });
    
    const davidThompson = await PoliticianModel.create({
      name: 'David Thompson',
      party: 'Independent',
      parish: 'St. Saviour',
      numberOfVotes: 7850,
      status: 'Current',
      bio: 'David Thompson is an Independent member representing St. Saviour parish. He focuses on agricultural policy, rural development, and environmental conservation.',
      firstElected: new Date('2022-05-15'),
      profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150',
      manifestoPoint1: 'Support local farming and agriculture',
      manifestoPoint2: 'Protect rural landscapes and heritage',
      manifestoPoint3: 'Develop sustainable tourism',
      manifestoPoint4: 'Improve rural broadband connectivity',
      manifestoPoint5: 'Enhance environmental conservation'
    });
    
    // Insert promises
    console.log("📋 Creating promises...");
    await PromiseModel.insertMany([
      // Jane Smith's promises
      {
        politicianId: janeSmith._id,
        title: 'Expand renewable energy investments',
        description: 'Promised to increase government funding for renewable energy research by 25% and successfully voted for the Clean Energy Act of 2022.',
        status: 'Fulfilled',
        fulfillmentDate: new Date('2022-03-15')
      },
      {
        politicianId: janeSmith._id,
        title: 'Increase minimum wage',
        description: 'Promised to support minimum wage increases and voted for the Fair Wage Act of 2021.',
        status: 'Fulfilled',
        fulfillmentDate: new Date('2021-07-20')
      },
      {
        politicianId: janeSmith._id,
        title: 'Expand healthcare coverage',
        description: 'Promised to work on healthcare reform to cover more residents. Bill still pending in committee.',
        status: 'InProgress'
      },
      {
        politicianId: janeSmith._id,
        title: 'Reform education funding',
        description: 'Promised to increase education funding by 20% and improve teacher salaries.',
        status: 'InProgress'
      },
      // John Doe's promises
      {
        politicianId: johnDoe._id,
        title: 'Strengthen border security',
        description: 'Promised to increase funding for border patrol and security infrastructure.',
        status: 'Fulfilled',
        fulfillmentDate: new Date('2021-06-10')
      },
      {
        politicianId: johnDoe._id,
        title: 'Tax cuts for small businesses',
        description: 'Promised tax relief for small businesses affected by economic challenges.',
        status: 'InProgress'
      },
      {
        politicianId: johnDoe._id,
        title: 'Increase defense spending',
        description: 'Promised to increase defense budget by 15% for national security.',
        status: 'Fulfilled',
        fulfillmentDate: new Date('2022-08-20')
      },
      // Maria Rodriguez's promises
      {
        politicianId: mariaRodriguez._id,
        title: 'Education system reform',
        description: 'Promised comprehensive education reform including teacher pay increases and curriculum updates.',
        status: 'InProgress'
      },
      {
        politicianId: mariaRodriguez._id,
        title: 'Environmental protection policies',
        description: 'Promised to implement strict environmental protection measures and carbon reduction targets.',
        status: 'InProgress'
      },
      {
        politicianId: mariaRodriguez._id,
        title: 'Social justice initiatives',
        description: 'Promised to work on equality measures and social justice programs.',
        status: 'Fulfilled',
        fulfillmentDate: new Date('2023-01-15')
      },
      // Robert Johnson's promises
      {
        politicianId: robertJohnson._id,
        title: 'Public transportation improvement',
        description: 'Promised to expand and improve public transportation systems across the parish.',
        status: 'InProgress'
      },
      {
        politicianId: robertJohnson._id,
        title: 'Healthcare access expansion',
        description: 'Promised to expand healthcare access programs for underserved communities.',
        status: 'Fulfilled',
        fulfillmentDate: new Date('2023-05-10')
      },
      // Sarah Williams's promises
      {
        politicianId: sarahWilliams._id,
        title: 'Small business support',
        description: 'Promised to create programs supporting small business development and growth.',
        status: 'InProgress'
      },
      {
        politicianId: sarahWilliams._id,
        title: 'Infrastructure improvements',
        description: 'Promised to improve roads and infrastructure throughout the parish.',
        status: 'Fulfilled',
        fulfillmentDate: new Date('2023-09-30')
      },
      // David Thompson's promises
      {
        politicianId: davidThompson._id,
        title: 'Agricultural support programs',
        description: 'Promised to create support programs for local farmers and agricultural development.',
        status: 'InProgress'
      },
      {
        politicianId: davidThompson._id,
        title: 'Rural broadband expansion',
        description: 'Promised to improve broadband connectivity in rural areas.',
        status: 'Fulfilled',
        fulfillmentDate: new Date('2023-06-25')
      }
    ]);
    
    // Insert bills
    console.log("📜 Creating bills...");
    const climateBill = await BillModel.create({
      title: 'Climate Protection Act',
      description: 'A bill to fund renewable energy research and limit carbon emissions across Guernsey.',
      dateVoted: new Date('2023-06-12')
    });
    
    const infrastructureBill = await BillModel.create({
      title: 'Infrastructure Funding Bill',
      description: 'A bill to fund infrastructure projects and road improvements across all parishes.',
      dateVoted: new Date('2023-05-28')
    });
    
    const defenseBill = await BillModel.create({
      title: 'Defense Spending Increase',
      description: 'A bill to increase the defense and security budget by 10%.',
      dateVoted: new Date('2023-05-15')
    });
    
    const educationBill = await BillModel.create({
      title: 'Education Funding Act',
      description: 'A bill to increase funding for public education and teacher salaries by 20%.',
      dateVoted: new Date('2023-04-23')
    });
    
    const healthcareBill = await BillModel.create({
      title: 'Healthcare Access Bill',
      description: 'A bill to expand healthcare access and services for all residents.',
      dateVoted: new Date('2023-07-10')
    });
    
    const businessBill = await BillModel.create({
      title: 'Small Business Support Act',
      description: 'A bill to provide tax incentives and support for small businesses.',
      dateVoted: new Date('2023-08-15')
    });
    
    const environmentBill = await BillModel.create({
      title: 'Environmental Conservation Bill',
      description: 'A bill to protect natural areas and implement conservation measures.',
      dateVoted: new Date('2023-09-05')
    });
    
    const ruralBill = await BillModel.create({
      title: 'Rural Development Act',
      description: 'A bill to support rural development and agricultural initiatives.',
      dateVoted: new Date('2023-10-20')
    });
    
    // Insert voting records
    console.log("🗳️  Creating voting records...");
    await VotingRecordModel.insertMany([
      // Jane Smith's votes
      { politicianId: janeSmith._id, billId: climateBill._id, vote: 'For' },
      { politicianId: janeSmith._id, billId: infrastructureBill._id, vote: 'For' },
      { politicianId: janeSmith._id, billId: defenseBill._id, vote: 'Against' },
      { politicianId: janeSmith._id, billId: educationBill._id, vote: 'For' },
      { politicianId: janeSmith._id, billId: healthcareBill._id, vote: 'For' },
      { politicianId: janeSmith._id, billId: businessBill._id, vote: 'For' },
      { politicianId: janeSmith._id, billId: environmentBill._id, vote: 'For' },
      { politicianId: janeSmith._id, billId: ruralBill._id, vote: 'For' },
      
      // John Doe's votes
      { politicianId: johnDoe._id, billId: climateBill._id, vote: 'Against' },
      { politicianId: johnDoe._id, billId: infrastructureBill._id, vote: 'For' },
      { politicianId: johnDoe._id, billId: defenseBill._id, vote: 'For' },
      { politicianId: johnDoe._id, billId: educationBill._id, vote: 'For' },
      { politicianId: johnDoe._id, billId: healthcareBill._id, vote: 'Against' },
      { politicianId: johnDoe._id, billId: businessBill._id, vote: 'For' },
      { politicianId: johnDoe._id, billId: environmentBill._id, vote: 'Against' },
      { politicianId: johnDoe._id, billId: ruralBill._id, vote: 'For' },
      
      // Maria Rodriguez's votes
      { politicianId: mariaRodriguez._id, billId: climateBill._id, vote: 'For' },
      { politicianId: mariaRodriguez._id, billId: infrastructureBill._id, vote: 'For' },
      { politicianId: mariaRodriguez._id, billId: defenseBill._id, vote: 'Against' },
      { politicianId: mariaRodriguez._id, billId: educationBill._id, vote: 'For' },
      { politicianId: mariaRodriguez._id, billId: healthcareBill._id, vote: 'For' },
      { politicianId: mariaRodriguez._id, billId: businessBill._id, vote: 'For' },
      { politicianId: mariaRodriguez._id, billId: environmentBill._id, vote: 'For' },
      { politicianId: mariaRodriguez._id, billId: ruralBill._id, vote: 'For' },
      
      // Robert Johnson's votes
      { politicianId: robertJohnson._id, billId: climateBill._id, vote: 'For' },
      { politicianId: robertJohnson._id, billId: infrastructureBill._id, vote: 'For' },
      { politicianId: robertJohnson._id, billId: defenseBill._id, vote: 'Abstained' },
      { politicianId: robertJohnson._id, billId: educationBill._id, vote: 'For' },
      { politicianId: robertJohnson._id, billId: healthcareBill._id, vote: 'For' },
      { politicianId: robertJohnson._id, billId: businessBill._id, vote: 'For' },
      { politicianId: robertJohnson._id, billId: environmentBill._id, vote: 'For' },
      { politicianId: robertJohnson._id, billId: ruralBill._id, vote: 'For' },
      
      // Sarah Williams's votes
      { politicianId: sarahWilliams._id, billId: climateBill._id, vote: 'Against' },
      { politicianId: sarahWilliams._id, billId: infrastructureBill._id, vote: 'For' },
      { politicianId: sarahWilliams._id, billId: defenseBill._id, vote: 'For' },
      { politicianId: sarahWilliams._id, billId: educationBill._id, vote: 'For' },
      { politicianId: sarahWilliams._id, billId: healthcareBill._id, vote: 'Against' },
      { politicianId: sarahWilliams._id, billId: businessBill._id, vote: 'For' },
      { politicianId: sarahWilliams._id, billId: environmentBill._id, vote: 'Against' },
      { politicianId: sarahWilliams._id, billId: ruralBill._id, vote: 'For' },
      
      // David Thompson's votes
      { politicianId: davidThompson._id, billId: climateBill._id, vote: 'For' },
      { politicianId: davidThompson._id, billId: infrastructureBill._id, vote: 'For' },
      { politicianId: davidThompson._id, billId: defenseBill._id, vote: 'Abstained' },
      { politicianId: davidThompson._id, billId: educationBill._id, vote: 'For' },
      { politicianId: davidThompson._id, billId: healthcareBill._id, vote: 'For' },
      { politicianId: davidThompson._id, billId: businessBill._id, vote: 'For' },
      { politicianId: davidThompson._id, billId: environmentBill._id, vote: 'For' },
      { politicianId: davidThompson._id, billId: ruralBill._id, vote: 'For' }
    ]);
    
    // Insert citizen ratings
    console.log("⭐ Creating ratings...");
    await RatingModel.insertMany([
      // Ratings for Jane Smith
      {
        politicianId: janeSmith._id,
        userId: 'citizen_001',
        rating: 4.5,
        comment: 'Jane has done excellent work on environmental issues and healthcare. She keeps her promises and communicates well with constituents.',
        status: 'Approved'
      },
      {
        politicianId: janeSmith._id,
        userId: 'citizen_002',
        rating: 4.0,
        comment: 'Good representation for St. Peter Port. Would like to see more progress on education funding.',
        status: 'Approved'
      },
      {
        politicianId: janeSmith._id,
        userId: 'citizen_003',
        rating: 5.0,
        comment: 'Outstanding work on renewable energy. She delivered exactly what she promised during the campaign.',
        status: 'Approved'
      },
      {
        politicianId: janeSmith._id,
        userId: 'citizen_004',
        rating: 3.5,
        comment: 'Generally positive but some policies could be more fiscally responsible.',
        status: 'Approved'
      },
      // Ratings for John Doe
      {
        politicianId: johnDoe._id,
        userId: 'citizen_005',
        rating: 3.5,
        comment: 'John is strong on defense and business issues but his environmental stance is concerning.',
        status: 'Approved'
      },
      {
        politicianId: johnDoe._id,
        userId: 'citizen_006',
        rating: 4.0,
        comment: 'Good fiscal conservative. Delivered on his business tax promises.',
        status: 'Approved'
      },
      {
        politicianId: johnDoe._id,
        userId: 'citizen_007',
        rating: 2.5,
        comment: 'Disappointed with his votes against healthcare and environmental bills.',
        status: 'Approved'
      },
      {
        politicianId: johnDoe._id,
        userId: 'citizen_008',
        rating: 4.5,
        comment: 'Excellent work supporting small businesses during tough economic times.',
        status: 'Approved'
      },
      // Ratings for Maria Rodriguez
      {
        politicianId: mariaRodriguez._id,
        userId: 'citizen_009',
        rating: 4.8,
        comment: 'Maria brings fresh perspective and truly represents independent values. Great work on social justice.',
        status: 'Approved'
      },
      {
        politicianId: mariaRodriguez._id,
        userId: 'citizen_010',
        rating: 4.0,
        comment: 'Appreciating her balanced approach and focus on education reform.',
        status: 'Approved'
      },
      {
        politicianId: mariaRodriguez._id,
        userId: 'citizen_011',
        rating: 5.0,
        comment: 'Best politician we have had in Vale. Accessible and committed to her constituents.',
        status: 'Approved'
      },
      // Ratings for Robert Johnson
      {
        politicianId: robertJohnson._id,
        userId: 'citizen_012',
        rating: 4.2,
        comment: 'Robert has done good work on healthcare access. Public transportation improvements are much needed.',
        status: 'Approved'
      },
      {
        politicianId: robertJohnson._id,
        userId: 'citizen_013',
        rating: 3.8,
        comment: 'Solid representation but would like to see more action on education promises.',
        status: 'Approved'
      },
      {
        politicianId: robertJohnson._id,
        userId: 'citizen_014',
        rating: 4.5,
        comment: 'Very responsive to constituent concerns and follows through on commitments.',
        status: 'Approved'
      },
      // Ratings for Sarah Williams
      {
        politicianId: sarahWilliams._id,
        userId: 'citizen_015',
        rating: 3.8,
        comment: 'Good work on infrastructure but disappointed with healthcare votes.',
        status: 'Approved'
      },
      {
        politicianId: sarahWilliams._id,
        userId: 'citizen_016',
        rating: 4.2,
        comment: 'Excellent support for small businesses in Forest parish.',
        status: 'Approved'
      },
      {
        politicianId: sarahWilliams._id,
        userId: 'citizen_017',
        rating: 3.0,
        comment: 'Mixed feelings about her environmental positions.',
        status: 'Approved'
      },
      // Ratings for David Thompson
      {
        politicianId: davidThompson._id,
        userId: 'citizen_018',
        rating: 4.7,
        comment: 'David truly understands rural issues and agricultural needs. Great work on broadband expansion.',
        status: 'Approved'
      },
      {
        politicianId: davidThompson._id,
        userId: 'citizen_019',
        rating: 4.3,
        comment: 'Excellent advocate for farmers and rural communities.',
        status: 'Approved'
      },
      {
        politicianId: davidThompson._id,
        userId: 'citizen_020',
        rating: 4.0,
        comment: 'Good balanced approach to development and conservation.',
        status: 'Approved'
      },
      // Some pending ratings for moderation
      {
        politicianId: janeSmith._id,
        userId: 'citizen_021',
        rating: 2.0,
        comment: 'This politician is terrible and corrupt!',
        status: 'Pending'
      },
      {
        politicianId: johnDoe._id,
        userId: 'citizen_022',
        rating: 1.0,
        comment: 'Complete waste of taxpayer money',
        status: 'Pending'
      },
      {
        politicianId: mariaRodriguez._id,
        userId: 'citizen_023',
        rating: 5.0,
        comment: 'Amazing work on everything!',
        status: 'Pending'
      }
    ]);
    
    // Insert admin log entries
    console.log("📝 Creating admin logs...");
    await AdminLogModel.insertMany([
      {
        userId: adminUser._id,
        action: 'Login',
        details: { ip: '192.168.1.1', userAgent: 'Mozilla/5.0' }
      },
      {
        userId: adminUser._id,
        action: 'Create Politician',
        details: { politicianId: janeSmith._id, name: 'Jane Smith', parish: 'St. Peter Port' }
      },
      {
        userId: adminUser._id,
        action: 'Update Promise',
        details: { promiseId: 1, oldStatus: 'InProgress', newStatus: 'Fulfilled' }
      },
      {
        userId: adminUser._id,
        action: 'Approve Rating',
        details: { ratingId: 1, politicianId: janeSmith._id, action: 'approved' }
      },
      {
        userId: adminUser._id,
        action: 'Create Bill',
        details: { billId: climateBill._id, title: 'Climate Protection Act' }
      },
      {
        userId: adminUser._id,
        action: 'Moderate Comment',
        details: { ratingId: 21, action: 'flagged_for_review', reason: 'inappropriate_language' }
      }
    ]);
    
    // Verify counts
    console.log("\n✅ Seed completed successfully!");
    console.log("📊 Data summary:");
    console.log(`   - Users: ${await UserModel.countDocuments()}`);
    console.log(`   - Politicians: ${await PoliticianModel.countDocuments()}`);
    console.log(`   - Promises: ${await PromiseModel.countDocuments()}`);
    console.log(`   - Bills: ${await BillModel.countDocuments()}`);
    console.log(`   - Voting Records: ${await VotingRecordModel.countDocuments()}`);
    console.log(`   - Ratings: ${await RatingModel.countDocuments()}`);
    console.log(`   - Admin Logs: ${await AdminLogModel.countDocuments()}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
