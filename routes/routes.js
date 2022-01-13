const express = require('express');
const sequelize = require('sequelize');
const router = express.Router();

const { asyncHandler } = require('../middleware/asyncHandler');
const { User } = require('../models');

let users_array = [];

router.get('/', asyncHandler( async(req, res) => {
    res.redirect('/api/users');
}));

router.get('/users', asyncHandler( async(req, res) => {
    let users = await User.findAll();
    res.json(users);
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

router.get('/test', asyncHandler( async(req, res) => {
    res.send(users_array);
}));

router.post('/test', asyncHandler( async(req, res) => {
    let testers = req.body;
    users_array.push(testers);
    res.end();
}));



module.exports = router;
