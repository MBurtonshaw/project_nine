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
    let users = await User.findAll();
    res.status(200).json(users);
}));

router.post('/users', asyncHandler( async(req, res) => {
      try {
        if (req.body.password) {
          req.body.password = bcrypt.hashSync(req.body.password, 10);
          let user = await User.create(req.body);
          res.setHeader('Location', '/api/users/' + user.id);
          res.status(201).end();
        } else {
          res.status(400).json({message: 'Please provide password'});
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw error;
        }
      }

}));

////////////////////////////////////////////////////////////////////////////////
//Routing -- Courses
////////////////////////////////////////////////////////////////////////////////

router.get('/courses', asyncHandler(async(req, res) => {
    let courses = await Course.findAll();
    res.status(200).json(courses);
}));

router.post('/courses', authenticateUser, asyncHandler(async(req, res) => {
  let course = await Course.create(req.body);
    try {
      if (course) {
        res.setHeader('Location', '/api/courses/' + course.id);
        res.status(201).end();
      } else {
        res.status(404).json({message: 'Please enter course information'});
      }
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw error;
        }
      }
}));

router.get('/courses/:id', asyncHandler( async( req, res) => {
  let course = await Course.findByPk(req.params.id);
  let owner = await User.findByPk(course.userId);
  res.status(200).json({
    Course_Owner: owner,
    Title: course.title,
    Description: course.description
  });
}));

router.put( '/courses/:id', authenticateUser, asyncHandler( async(req, res) => {
  let course = await Course.findByPk(req.params.id);
  if (course) {
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
    res.json({message: 'Error; course not found'});
  }
}));

router.delete( '/courses/:id', authenticateUser, asyncHandler( async(req, res) => {
  let course = await Course.findByPk(req.params.id);
  if (course) {
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
    res.json({message: 'Error; course not found'});
  }
}));

module.exports = router;