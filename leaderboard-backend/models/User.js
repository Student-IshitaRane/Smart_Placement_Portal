const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  year: { type: Number, required: true },
  branch: { type: String, required: true },
  cgpa: { type: Number, required: true },
  leetcodeId: { type: String, required: true },
  gfgId: { type: String, required: true },
  codeforcesId: { type: String, required: true },
  dob: { type: Date, required: true },
  score: { type: Number, default: 0 },
  leetcodeScore: { type: Number, default: 0 },
  gfgScore: { type: Number, default: 0 },
  codeforcesScore: { type: Number, default: 0 },
  placed: { 
    type: Boolean, 
    default: false,
    required: true,
    validate: {
      validator: function(v) {
        return typeof v === 'boolean';
      },
      message: 'Placed must be a boolean'
    }
  },
  password: { type: String, required: true } // Keep the password field as-is
}, { timestamps: true });



const User = mongoose.model('User', userSchema);
module.exports = User;