const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  YourName: {
    type: String,
    required: true,
  },
  Number: {
    type: String,
    required: true,
  },
  YourProduct: {
    type: String,
    required: true,
  },
  YourSuitableTime: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    // Add validation for email format if needed
  },
},{timestamps:true});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;
