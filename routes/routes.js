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
    let users = await User.findAll({
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      }
    });
    res.status(200).json(users);
}));

router.get('/users/:id', asyncHandler( async(req, res) => {
  let user = await User.findByPk(req.params.id, {
    attributes: {
      exclude: ['password', 'createdAt', 'updatedAt']
    }
  });
  res.status(200).json(user);
}));

router.delete('/users/:id', authenticateUser, asyncHandler( async(req, res) => {
  let user = await User.findByPk(req.params.id);
  user.destroy();
  res.status(204).end();
}));

router.post('/users', asyncHandler( async(req, res) => {
  const format = /^[^@]+@[^@.]+.[a-z]+$/i;

        if (req.body.password) {
          try{
              req.body.password = bcrypt.hashSync(req.body.password, 10);
              let user = await User.create(req.body);

              if (!req.body.emailAddress.match(format)) {
                throw new Error('Please enter a valid email address');
            } else {
              res.setHeader('Location', '/');
              res.status(201).end();
            }
        
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
              const errors = error.errors.map(err => err.message);
              res.status(403).json({ errors });   
            } else {
              throw error;
        }
      }
    } else {
      throw new Error('Please enter a password');
    }
}));

////////////////////////////////////////////////////////////////////////////////
//Routing -- Courses
////////////////////////////////////////////////////////////////////////////////

router.get('/courses', asyncHandler(async(req, res) => {
    let courses = await Course.findAll({
      include: {model: User},
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
    });
    res.status(200).json(courses);
}));

router.post('/courses', authenticateUser, asyncHandler(async(req, res) => {
  if (req.body) {
      try {
        await Course.create(req.body);
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
}));

router.get('/courses/:id', asyncHandler( async( req, res) => {
  let course = await Course.findByPk(req.params.id, {
    include: {model: User},
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