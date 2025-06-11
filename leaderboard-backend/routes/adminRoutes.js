

const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/adminController');

router.post('/AdminRegister', registerAdmin);
router.post('/AdminLogin', loginAdmin);

module.exports = router;