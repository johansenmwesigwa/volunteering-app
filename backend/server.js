const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Opportunity = require('./models/Opportunity');
const Application = require('./models/Application');
const opportunityRoutes = require('./routes/opportunityRoutes');

const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://johansenmwesigwa:k6WbSGk9DXLsWVr0@volapp.wp6bw3i.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// DEFAULT HOME
app.get('/', (req, res) => {
  console.log('GET / called');
  res.send('API is running...');
});

// API Routes
app.use('/api/opportunities', opportunityRoutes);

// Apply for an opportunity (still inside server.js for now)
console.log('Setting up POST /api/apply route');
app.post('/api/apply', async (req, res) => {
  try {
    const { applicantEmail, opportunityId } = req.body;
    const existingApplication = await Application.findOne({ applicantEmail: { $eq: applicantEmail }, opportunityId: { $eq: opportunityId } });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this opportunity.' });
    }

    const application = new Application(req.body);
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));