const mongoose = require('mongoose');
const Opportunity = require('./models/Opportunity');

async function seed() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect('mongodb+srv://johansenmwesigwa:k6WbSGk9DXLsWVr0@volapp.wp6bw3i.mongodb.net/');

    console.log('MongoDB connected');

    // 2. Clear existing opportunities
    await Opportunity.deleteMany({});
    console.log('Old opportunities deleted');

    // 3. Sample opportunities
    const opportunities = [
      {
        title: 'Community Garden Helper',
        description: 'Assist with planting and maintaining a community vegetable garden.',
        duration: '3 months',
        location: 'Majengo, Moshi',
      },
      {
        title: 'Literacy Program Volunteer',
        description: 'Help children improve their reading and writing skills after school.',
        duration: '6 months',
        location: 'TRA, Moshi',
      },
      {
        title: 'Senior Care Companion',
        description: 'Spend time with seniors in a care facility, playing games and chatting.',
        duration: 'Ongoing',
        location: 'Njoro, Moshi',
      },
    ];

    // 4. Insert new opportunities
    await Opportunity.insertMany(opportunities);
    console.log('Database seeded with sample opportunities!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

seed();