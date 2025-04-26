const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Opportunity = require('./models/Opportunity');
const Application = require('./models/Application');

const app = express();

const corsOptions = {
  origin: '*', // allow ALL origins (frontend included)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://johansenmwesigwa:k6WbSGk9DXLsWVr0@volapp.wp6bw3i.mongodb.net/?retryWrites=true&w=majority&appName=VolApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// DEFAULT HOME
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Get all opportunities
app.get('/api/opportunities', async (req, res) => {
  const opportunities = await Opportunity.find();
  res.json(opportunities);
});

// Create a new opportunity
app.post('/api/opportunities', async (req, res) => {
  const { title, description, duration, location } = req.body;
  const opportunity = new Opportunity({ title, description, duration, location });
  await opportunity.save();
  res.status(201).json(opportunity);
});

// Apply for an opportunity
app.post('/api/apply', async (req, res) => {
  const { applicantEmail, opportunityId } = req.body;

  // Check if user already applied
  const existingApplication = await Application.findOne({ applicantEmail, opportunityId });

  if (existingApplication) {
    return res.status(400).json({ message: 'You have already applied for this opportunity.' });
  }

  // Save new application
  const application = new Application(req.body);
  await application.save();
  res.status(201).json(application);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));