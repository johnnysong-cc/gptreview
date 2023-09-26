//
// A GraphQL schema that defines types, queries and mutations
//
var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var GraphQLBoolean = require('graphql').GraphQLBoolean;
//
var UserModel = require('../models/User');
//
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "some_secret_key"; // generate this elsewhere
const jwtExpirySeconds = 300;
//
// Create a GraphQL Object Type for User model
// The fields object is a required property of a GraphQLObjectType 
// and it defines the different fields or query/mutations that are available
// in this type.
const userType = new GraphQLObjectType({
    name: 'user',
    fields: function () {
      return {
        
        userName: {
          type: GraphQLString
        },
        email: {
          type: GraphQLString
        },
        password: {
          type: GraphQLString
        }
        
        
      }
    }
  });
  //
  
  // Create a GraphQL query type that returns a user by id
  // In this case, the queries are defined within the fields object.
  // The fields object is a required property of a GraphQLObjectType 
  // and it defines the different fields or query/mutations that are available
  // in this type. 
  //
  const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
      return {

        users: {
          type: new GraphQLList(userType),
          resolve: function () {
            const users = UserModel.find().exec()
            if (!users) {
              throw new Error('Error')
            }
            return users
          }
        },
        user: {
          type: userType,
          args: {
            id: {
              name: '_id',
              type: GraphQLString
            }
          },
          resolve: function (root, params) {
            const userInfo = UserModel.findById(params.id).exec()
            if (!userInfo) {
              throw new Error('Error')
            }
            return userInfo
          }
        },
        // check if user is logged in
        isLoggedIn: {
          type: GraphQLString,
          args: {
            email: {
              name: 'email',
              type: GraphQLString
            }

          },
          resolve: function (root, params, context) {
            //
            console.log(params)
            console.log('in isLoggedIn.....')
           // console.log(context.req.cookies['token'])
            //const req = context.req;
            //const res = context.res;
            console.log('token: ')
            //
            const token = null;
            // if the cookie is not set, return 'auth'
            if (!context || !context.req || !context.req.cookies || !context.req.cookies.token) {
              return 'auth';
            }
            else {
              token = context.req.cookies.token;
            }
            var payload;
            try {
              // Parse the JWT string and store the result in `payload`.
              // Note that we are passing the key in this method as well. 
              // This method will throw an error
              // if the token is invalid (if it has expired according to the expiry time
              //  we set on sign in), or if the signature does not match
              payload = jwt.verify(token, JWT_SECRET)
            } catch (e) {
              if (e instanceof jwt.JsonWebTokenError) {
              // the JWT is unauthorized, return a 401 error
              console.log('jwt error')
              return context.res.status(401).end()
              }
              // otherwise, return a bad request error
              console.log('bad request error')
              return context.res.status(400).end()
            }
            console.log('email from payload: ', payload.email)
            // Finally, token is ok, return the email given in the token
            // res.status(200).send({ screen: payload.email });
            return payload.email;

          }
        },
        
      }
    }
  });
  //
  // Add a mutation for creating user
  // In this case, the createUser mutation is defined within the fields object.
  const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
      return {
        createUser: {
          type: userType,
          args: {
            userName: {
              type: new GraphQLNonNull(GraphQLString)
            },
            email: {
              type: new GraphQLNonNull(GraphQLString)
            },
            password: {
              type: new GraphQLNonNull(GraphQLString)
            }
            
          },
          resolve: function (root, params, context) {
            const userModel = new UserModel(params);
            const newUser = userModel.save();
            if (!newUser) {
              throw new Error('Error');
            }
            return newUser
          }
        },
        
        // a mutation to log in the user
        loginUser: {
          type: GraphQLString,
          args: {
            email: {
              name: 'email',
              type: GraphQLString
            },
            password: {
              name: 'password',
              type: GraphQLString

            }

          },

          resolve: async function (root, params, context) {
            console.log('email:', params.email)
            // find the user with email if exists
            const userInfo = await UserModel.findOne({email: params.email}).exec()
            console.log(userInfo)
            if (!userInfo) {
              throw new Error('Error - user not found')
            }
            console.log('email:', userInfo.email)
            console.log('entered pass: ',params.password)
            console.log('hash', userInfo.password)
            // check if the password is correct
            bcrypt.compare(params.password, userInfo.password, (err, result) => {
              if (err) {
                throw err
              } else if (!result) {
                console.log("Password doesn't match!")
              } else {
                console.log("Password matches!")
              }
            })
            // sign the given payload (arguments of sign method) into a JSON Web Token 
            // and which expires 300 seconds after issue
            const token = jwt.sign({ _id: userInfo._id, email: userInfo.email }, JWT_SECRET, 
              {algorithm: 'HS256', expiresIn: jwtExpirySeconds });
            console.log('registered token:', token)

            // set the cookie as the token string, with a similar max age as the token
            // here, the max age is in milliseconds
            context.res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000, httpOnly: true});
            //context.res.status(200).send({ screen: userInfo.username });
            return userInfo.email; 
            //return { screen: userInfo.username }
            //return {token, userId: userInfo._id}
          } //end of resolver function
        },
        // a mutation to log the user out
        logOut: {
          type: GraphQLString,
          resolve: (parent, args, { res }) => {
            res.clearCookie('token');
            return 'Logged out successfully!';
          },
        },
        //

      }
    }
  });
  //
  module.exports = new GraphQLSchema({query: queryType, mutation: mutation});
  