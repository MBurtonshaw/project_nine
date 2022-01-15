const express = require('express');
const sequelize = require('sequelize');
const router = express.Router();
const bcrypt = require('bcrypt');

const { asyncHandler } = require('../middleware/asyncHandler');
const { User, Course } = require('../models');

router.get('/', asyncHandler( async(req, res) => {
    res.redirect('/api/users');
}));

router.get('/users', asyncHandler( async(req, res) => {
    let users = await User.findAll();
    res.status(200).json(users);
}));

router.post('/users', asyncHandler( async(req, res) => {
    try {
      await User.create(req.body);
      res.status(201).json({'message' : 'account created'});
  } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }

}));

router.get('/courses', asyncHandler(async(req, res) => {
    let courses = await Course.findAll();
    res.status(200).json(courses);
}));

router.post('/courses', asyncHandler(async(req, res) => {
  let course = await Course.create(req.body);
    try {
      if (course) {
        res.setHeader('Location', '/api/courses/');
        res.status(201).json({ 'message' : 'course created' });
      } else {
        res.status(404).json({message: 'Course does not exist'});
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
  res.status(200).json(course);
}));

router.put( '/courses/:id', asyncHandler( async(req, res) => {
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

router.delete( '/courses/:id', asyncHandler( async(req, res) => {
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