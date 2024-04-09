const { default: mongoose } = require('mongoose');


// Define the user schema
const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    otp: Number,
});

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;