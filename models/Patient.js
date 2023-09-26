// Load the Mongoose module and Schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a new 'IncidentSchema'
const PatientSchema = new Schema({
    id: String,
    firstName: String,
    lastName: String,
    age: String,
    diagonosis: String,
    notes: String,
    hcnNo: String
    
	
});

// Create the 'Student' model out of the 'StudentSchema'
module.exports = mongoose.model('Patient', PatientSchema);