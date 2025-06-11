const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  status: { type: String, default: 'Applied' },
  appliedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Application', applicationSchema);
