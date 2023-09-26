var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var AppointmentModel = require('../models/Appointment');
//
// Create a GraphQL Object Type for Appointment model
const appointmentType = new GraphQLObjectType({
  name: 'appointment',
  fields: function () {
    return {
      id: {
        type: GraphQLID
      },
      patientId: {
        type: GraphQLString
      },
      patientName: {
        type: GraphQLString
      },
      date: {
        type: GraphQLDate
      },
      doctor: {
        type: GraphQLString
      },
      department: {
        type: GraphQLString
      },
      diagnosis: {
        type: GraphQLString
      },
      treatmentPlan: {
        type: GraphQLString
      }
    }
  }
});
//
// create a GraphQL query type that returns all appointments or appointments by department
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: function () {
    return {
      appointments: {
        type: new GraphQLList(appointmentType),
        args: {
          department: {
            type: GraphQLString
          }
        },
        resolve: function (root, params) {
          const appointments = AppointmentModel.find(params).exec()
          if (!appointments) {
            throw new Error('Error')
          }
          return appointments
        }
      }
    }
  }
});
//
// add mutations for CRUD operations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function () {
    return {
      addAppointment: {
        type: appointmentType,
        args: {
          patientId: {
            type: new GraphQLNonNull(GraphQLString)
          },
          patientName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          date: {
            type: new GraphQLNonNull(GraphQLDate)
          },
          doctor: {
            type: new GraphQLNonNull(GraphQLString)
          },
          department: {
            type: new GraphQLNonNull(GraphQLString)
          },
          diagnosis: {
            type: new GraphQLNonNull(GraphQLString)
          },
          treatmentPlan: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {
          const appointmentModel = new AppointmentModel(params);
          const newAppointment = appointmentModel.save();
          if (!newAppointment) {
            throw new Error('Error');
          }
          return newAppointment
        }
      },
      updateAppointment: {
        type: appointmentType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLID)
          },
          patientId: {
            type: new GraphQLNonNull(GraphQLString)
          },
          patientName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          date: {
            type: new GraphQLNonNull(GraphQLDate)
          },
          doctor: {
            type: new GraphQLNonNull(GraphQLString)
          },
          department: {
            type: new GraphQLNonNull(GraphQLString)
          },
          diagnosis: {
            type: new GraphQLNonNull(GraphQLString)
          },
          treatmentPlan: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, params) {
          return AppointmentModel.findByIdAndUpdate(params.id, { 
            patientId: params.patientId,
            patientName: params.patientName,
            date: params.date,
            doctor: params.doctor,
            department: params.department,
            diagnosis: params.diagnosis,
            treatmentPlan: params.treatmentPlan
            }, function (err) {
            if (err) console.log(err);
            });
            }
            },
            deleteAppointment: {
            type: appointmentType,
            args: {
            id: {
            type: new GraphQLNonNull(GraphQLID)
            }
            },
            resolve(root, params) {
            const deletedAppointment = AppointmentModel.findByIdAndRemove(params.id).exec();
            if (!deletedAppointment) {
            throw new Error('Error')
            }
            return deletedAppointment;
            }
            }
            }
            }
            });
            
            module.exports = new GraphQLSchema({query: queryType, mutation: mutation});
