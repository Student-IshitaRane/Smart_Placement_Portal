const express = require('express');
const router = express.Router();
const { addUser, loginUser, getAllUsers } = require('../controllers/userController');

// Add new user (Registration)
router.post('/register', addUser);

// Login an existing user
router.post('/login', loginUser);

router.get('/StudentList', getAllUsers);



module.exports = router;
