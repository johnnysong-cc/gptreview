// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const { stitchSchemas } = require('@graphql-tools/stitch');

// Load the module dependencies
const configureMongoose = require('./config/mongoose');
const configureExpress = require('./config/express');
//
const { graphqlHTTP } = require('express-graphql');

var ambulanceRequestSchema = require('./graphql/ambulanceRequestSchemas');

var incidentSchema = require('./graphql/incidentReportSchemas');
var patientRecordSchema = require('./graphql/patientRecordSchema');

const userSchema = require('./graphql/userSchemas');
const ambulanceSchema = require('./graphql/ambulanceSchemas');
const patientSchema = require('./graphql/PatientSchemas');


const mergedSchema = stitchSchemas({
  subschemas: [userSchema, ambulanceSchema, patientSchema,ambulanceRequestSchema,incidentSchema],
});



var cors = require("cors");
const bodyParser = require('body-parser');


// Create a new Mongoose connection instance
const db = configureMongoose();

// Create a new Express application instance
const app = configureExpress();
//
// recommended to specify the exact origins that are allowed
// to access the server and also to set appropriate CORS headers
// for handling credentials.
// more secure than: app.use('*', cors());
// you may choose not to allow cross-origin requests
const corsOptions = {
  origin: ["http://localhost:3000"], //included origin as true
  credentials: true, //included credentials as true
};
app.use(cors(corsOptions));
//
//configure GraphQL to use over HTTP
// Setting up a GraphQL API endpoint using Express.js and the express-graphql
// library, with a schema, root value, and context object configured to handle
// incoming GraphQL queries. It also enables the GraphiQL UI for easy testing
// and debugging.
app.use('/graphql', graphqlHTTP( (request, response) =>  {
  return {
    schema: mergedSchema,
    rootValue: global,
    graphiql: true,
    context: {
      
      req: request,
      res: response
    }
  }
}));
//
// Use the Express application instance to listen to the '4000' port
app.listen(4000, () => console.log('Express GraphQL Server Now Running On http://localhost:4000/graphql'));

// Use the module.exports property to expose our Express application instance for external usage
module.exports = app;