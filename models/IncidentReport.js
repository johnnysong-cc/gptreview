// Load the Mongoose module and Schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a new 'IncidentSchema'
const IncidentSchema = new Schema({
    id: String,
    issue:String,
    casenumber:String,
    date:Date,
    medium:String,
    location:String,
    reporter:String,
    status:String
    
	
});

// Create the 'Student' model out of the 'StudentSchema'
module.exports = mongoose.model('Incident', IncidentSchema);