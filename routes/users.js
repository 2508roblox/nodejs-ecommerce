 
var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller');
const User = require('../models/user.schema');

/* GET users listing */
router.get('/', function(req, res, next) {
  // Fetch all users from the database
  User.find({}, {password : 0})
    .exec()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.error('Error fetching users:', err);
      res.status(500).send('Internal Server Error');
    });
});

// Register a new user
router.post('/register', userController.registerUser);

// User login
router.post('/login', userController.loginUser);
// Change password
router.post('/change-password', userController.changePassword);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
// Refresh access token using refresh token
router.post('/refresh-token', userController.refreshToken);
module.exports = router;