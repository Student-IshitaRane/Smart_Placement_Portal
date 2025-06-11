const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);