const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');
const rateLimit = require('express-rate-limit');

// Configure rate limiter: maximum of 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: "Too many requests, please try again later." }
});

// Get all opportunities
router.get('/', limiter, async (req, res) => {
    try {
      const opportunities = await Opportunity.find();
      console.log('Fetched opportunities:', opportunities);
      res.json(opportunities);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Create a new opportunity
router.post('/', async (req, res) => {
  try {
    const { title, description, duration, location } = req.body;
    const opportunity = new Opportunity({ title, description, duration, location });
    await opportunity.save();
    res.status(201).json(opportunity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;