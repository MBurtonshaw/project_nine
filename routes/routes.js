const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

let users = [];

router.get('/', (req, res) => {
    res.redirect('/users');
});

router.get('/users', (req, res) => {
    res.json(users);
});

router.post('/users', (req, res) => {
    const user = req.body;

    //req.body is undefined?
    const errors = [];

    if (!user.firstName) {
        errors.push('Please provide a first name');
    }
    if (!user.lastName) {
        errors.push('Please provide a last name');
    }
    if (!user.emailAddress) {
        errors.push('Please provide a valid email address');
    }
    let password = user.password;
    if (!user.password) {
        errors.push('Please provide a password between 8-20 characters');
    } else if (password.length < 8 || password.length > 20) {
        errors.push('Password must be between 8-20 characters');
    } else {
        user.password = bcrypt.hashSync(password, 10);
    }

    if (errors.length > 0) {
        res.status(401).json({ errors });
    } else {
        users.push(user);
        res.status(201).end();
    }
});



module.exports = router;