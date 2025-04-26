const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');

// Get all opportunities
router.get('/', async (req, res) => {
  try {
    const opportunities = await Opportunity.find();
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