const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
name: String,
age: Number,
gender: String,
diagnosis: String,
notes: String,
});

const departmentSchema = new mongoose.Schema({
name: String,
});

const appointmentSchema = new mongoose.Schema({
patientId: mongoose.Schema.Types.ObjectId,
patientName: String,
date: Date,
doctor: String,
department: String,
diagnosis: String,
treatmentPlan: String,
});

const Patient = mongoose.model('Patient', patientSchema);
const Department = mongoose.model('Department', departmentSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = { Patient, Department, Appointment };