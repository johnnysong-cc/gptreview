// Load the Mongoose module and Schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a new 'BillingSchema'
const BillingSchema = new Schema({
id:String,
patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  serviceType: {
    type: String,
    required: true
  },
  serviceProvider: {
    type: String,
    required: true
  },
  serviceLocation: {
    type: String,
    required: true
  },
  totalBillAmount: {
    type: Number,
    required: true
  },
  insuranceBilledAmount: {
    type: Number
  },
  amountPaid: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentDate: {
    type: Date,
    required: true
  },
});

module.exports = mongoose.model('BillingInfo', BillingSchema);