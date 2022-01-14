const express = require('express');
const sequelize = require('sequelize');
const router = express.Router();

const { asyncHandler } = require('../middleware/asyncHandler');
const { User, Course } = require('../models');

let users_array = [];

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

router.get('/courses/:id', asyncHandler( async( req, res) => {
    let course = await Course.findByPk(req.params.id);
    res.status(200).json(course);
}));

router.post('/courses', asyncHandler(async(req, res) => {
    try {
        await Course.create(req.body);
        res.status(201).json({ 'message' : 'course created' });
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw error;
        }
      }
}));



module.exports = router;