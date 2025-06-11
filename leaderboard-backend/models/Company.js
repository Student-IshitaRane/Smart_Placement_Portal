const mongoose = require('mongoose'); // Add this line at the top

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  ctc: { type: Number, required: true },
  eligibility: {
    minCgpa: { type: Number, required: true },
    allowedBranches: { 
      type: [String], 
      required: true,
      validate: {
        validator: (branches) => branches.length > 0,
        message: 'At least one branch must be specified'
      }
    },
    year: {
      type: Number,
      required: true,
      enum: [2, 3, 4], // Now includes 2nd year
      default: 4
    }
  },
  testDate: { type: Date, required: true },
  interviewDate: { type: Date, required: true },
  notes: { type: String },
  finalized: { type: Boolean, default: false }  // ✅ moved inside
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
