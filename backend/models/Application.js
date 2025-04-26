const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
  applicantName: { type: String, required: true },
  applicantEmail: { type: String, required: true },
});

module.exports = mongoose.model('Application', ApplicationSchema);
