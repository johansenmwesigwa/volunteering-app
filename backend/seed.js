const mongoose = require('mongoose');
const Opportunity = require('./models/Opportunity');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/volunteerApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Clear existing opportunities
  await Opportunity.deleteMany({});

  // Sample opportunities
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

  await Opportunity.insertMany(opportunities);
  console.log('Database seeded with sample opportunities!');

  mongoose.connection.close();
}

seed();