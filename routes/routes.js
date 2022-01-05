const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../db/models/user');
const { asyncHandler } = require('../db/middleware/asyncHandler');

let users = [];

router.get('/', asyncHandler( async(req, res) => {
    res.redirect('/users');
}));

router.get('/users', asyncHandler( async(req, res) => {
    res.json(users);
}));

router.post('/users', asyncHandler( async(req, res) => {
    try {
        let user = await User.create(req.body);
        res.status(201).json({'message' : 'account created'});
        users.push(user);
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