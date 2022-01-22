const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
//
const { authenticateUser } = require('../middleware/auth-user');
const { asyncHandler } = require('../middleware/asyncHandler');
const { User, Course } = require('../models');

////////////////////////////////////////////////////////////////////////////////
//Routing -- Users
////////////////////////////////////////////////////////////////////////////////
router.get('/', asyncHandler( async(req, res) => {
    res.redirect('/api/courses');
}));

router.get('/users', authenticateUser, asyncHandler( async(req, res) => {
  //Taking auth header from authenticateUser and setting to a variable
    let user = req.currentUser;
    //Returning User object of current user
    res.status(200).json({ user });
}));

router.get('/users/:id', asyncHandler( async(req, res) => {
  //Finding a user based on the id in the url
  let user = await User.findByPk(req.params.id, {
    //Excluding certain attributes from the public
    attributes: {
      exclude: ['password', 'createdAt', 'updatedAt']
    }
  });
  //Returning User object
  res.status(200).json({ user });
}));

router.delete('/users/:id', authenticateUser, asyncHandler( async(req, res) => {
  //Selecting user by id parameter
  let user = await User.findByPk(req.params.id);
  user.destroy();
  res.status(204).end();
}));

router.post('/users', asyncHandler( async(req, res) => {
  //If there is a req.body being submitted, proceed
    if (req.body) {
    try {
      //Create a new User w req.body, encrypt the password, and set its location header
        await User.create(req.body);
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        res.setHeader('Location', '/');
        res.status(201).end();
        
        } catch (error) {
          //If any error thrown is classified as a Sequelize validation error, map those errors
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
              const errors = error.errors.map(err => err.message);
              res.status(400).json({ errors });   
            } else {
              //Else, just a message
              res.status(400).json({'message' : 'Invalid login credentials'});
        }
      }
    } else {
      res.json({'message' : 'Invalid login credentials'});
    }
}));

////////////////////////////////////////////////////////////////////////////////
//Routing -- Courses
////////////////////////////////////////////////////////////////////////////////

router.get('/courses', asyncHandler(async(req, res) => {
    let courses = await Course.findAll({
      include: {model: User, attributes: {
        exclude: ['createdAt', 'updatedAt', 'password']
      }},
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
    });
    res.status(200).json(courses);
}));

router.post('/courses', authenticateUser, asyncHandler(async(req, res) => {
  if (req.body) {
      try {
        let course = await Course.create(req.body);
        res.setHeader('Location', '/api/courses/' + course.id);
        res.status(201).end();
      } catch(error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw error;
        }
      }
  } else {
      res.status(403).json({message: 'Error: invalid credentials'});
    } 
}));

router.get('/courses/:id', asyncHandler( async( req, res) => {
  let course = await Course.findByPk(req.params.id, {
    include: {model: User, attributes: {
      exclude: ['createdAt', 'updatedAt', 'password']
    }},
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  });
  res.status(200).json({
    course
  });
}));

router.put( '/courses/:id', authenticateUser, asyncHandler( async(req, res) => {
  let course = await Course.findByPk(req.params.id);
  let owner = await User.findByPk(course.userId);
  if (course) {
    if (owner.id === req.currentUser.id) {
      try {
        await course.update(req.body);
        res.status(204).end();
      } catch(error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw error;
        }
      }
  } else {
      res.status(403).json({message: 'Error: invalid credentials'});
    } 
  }
}));

router.delete( '/courses/:id', authenticateUser, asyncHandler( async(req, res) => {
  let course = await Course.findByPk(req.params.id);
  let owner = await User.findByPk(course.userId);
  if (course) {
    if (owner.id === req.currentUser.id) {
      try {
        await course.destroy();
        res.status(204).end();
      } catch(error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw error;
        }
      }
    } else {
      res.status(403).json({message: 'Error; invalid credentials'});
  }
  }
}));

module.exports = router;