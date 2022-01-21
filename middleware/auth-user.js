'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User, Course } = require('../models');
const course = require('../models/course');

exports.authenticateUser = async (req, res, next) => {
  // For future error message purposes
    let message;

  // Parse the user's credentials from the Authorization header.
  // The auth() function is referencing req to retrieve client info.
    const credentials = auth(req);
    
  // If the user's credentials are available...
    // Attempt to retrieve the user from the data store
    // by their username (i.e. the user's "key"
    // from the Authorization header).
    if (credentials) {
        const user = await User.findOne({ where: { emailAddress: credentials.name }});

    // If a user was successfully retrieved from the data store...
    // Use the bcrypt npm package to compare the user's password
    // (from the Authorization header) to the user's password
    // that was retrieved from the data store.
        if (user) {
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);

    // If the passwords match...
    // Store the retrieved user object on the request object
    // so any middleware functions that follow this middleware function
    // will have access to the user's information.
            if (authenticated) {
                console.log('Authentication successful, ' + user.firstName);
                req.currentUser = user;
                res.json({
                    id: user.id,
                    name: user.firstName + ' ' + user.lastName,
                    emailAddress: user.emailAddress
                });
                //currentUser is a property being created right here
                //and being stored on req

     // If user authentication failed...
     // Return a response with a 401 Unauthorized HTTP status code.
            } else {
                message = 'Authentication failed';
            }
        } else {
            message = 'Username not found';
        }
    } else {
        message = 'Auth header not found';
    }

    // Or if user authentication succeeded...
    // Call the next() method.
    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }


     
};