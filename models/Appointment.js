const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Model schema for Appointment

const AppointmentSchema = new Schema({
    id: {
        type: String,
    },
    patientId: {
    type: String,
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  doctor: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  treatmentPlan: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);