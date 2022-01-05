const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/users');
});

router.get('/users', (req, res) => {
    res.json({message: 'yayyyyyy'});
});