const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  location: { type: String, required: true },
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);