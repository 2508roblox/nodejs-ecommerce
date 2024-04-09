const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');
const User = require('../models/user.schema');
const jwt = require('jsonwebtoken');
 
const nodemailer =  require('nodemailer');


// Register a new user
const registerUser = async (req, res, next) => {
    // Get user information from the request
    const { firstName, lastName, email, password } = req.body;
    const fullname = firstName + lastName;
  
    try {
      // Check if the email is already registered
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        // Email is already registered
        return res.status(400).send('Email is already registered');
      }
  
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new User object with the hashed password
      const newUser = new User({
        fullname: fullname,
        email: email,
        password: hashedPassword
      });
  
      // Save the new user to the database
      await newUser.save();
  
      // Generate access token and refresh token
      const accessToken = generateAccessToken(newUser._id);
      const refreshToken = generateRefreshToken(newUser._id);
  
      // User successfully registered with access token and refresh token
      res.status(200).json({ user: newUser, accessToken, refreshToken });
    } catch (err) {
      // Handle errors if any
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  };
  
  // Generate an access token
  const generateAccessToken = (userId) => {
    const accessToken = jwt.sign({ userId }, 'your-access-token-secret', { expiresIn: '60m' });
    return accessToken;
  };
  
  // Generate a refresh token
  const generateRefreshToken = (userId) => {
    const refreshToken = jwt.sign({ userId }, 'your-refresh-token-secret');
    return refreshToken;
  };
  
  // Refresh access token using refresh token
  const refreshToken = (req, res, next) => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      return res.sendStatus(401);
    }
  
    jwt.verify(refreshToken, 'your-refresh-token-secret', (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
  
      const accessToken = generateAccessToken(user.userId);
      res.status(200).json({ accessToken });
    });
  };
  
// User login
const loginUser = async (req, res, next) => {
    // Get login information from the request
    const { email, password } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email: email });
      if (!user) {
        // User does not exist
        return res.status(400).send('Invalid email or password');
      }
  
      // Compare the password with the hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        // Password does not match
        return res.status(400).send('Invalid email or password');
      }
  
      // Generate access token and refresh token
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
  
      // User successfully logged in with access token and refresh token
      res.status(200).json({user,  accessToken, refreshToken });
    } catch (err) {
      // Handle errors if any
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  };
  
  module.exports = { registerUser, loginUser, refreshToken };
const changePassword = async (req, res, next) => {
    // Get user information from the request
    const { email, currentPassword, newPassword } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email: email });
      if (!user) {
        // User does not exist
        return res.status(400).send('Invalid email');
      }
  
      // Compare the current password with the hashed password
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        // Current password is incorrect
        return res.status(400).send('Incorrect current password');
      }
  
      // Hash the new password using bcrypt
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password
      user.password = hashedNewPassword;
      await user.save();
  
      // Password successfully changed
      res.status(200).send('Password changed successfully');
    } catch (err) {
      // Handle errors if any
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  };
  const forgotPassword = async (req, res, next) => {
    // Get user information from the request
    const { email } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email: email });
      if (!user) {
        // User does not exist
        return res.status(400).send('Invalid email');
      }
  
      // Generate a random OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      
      // Save the OTP to the user
      user.otp = otp;
      await user.save();
  
      // Send the OTP to the user's email
      var transporter =  nodemailer.createTransport({ // config mail server
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'trangiangzxc@gmail.com', //Tài khoản gmail vừa tạo
            pass: 'efol rgcm hxqd aznv' //Mật khẩu tài khoản gmail vừa tạo
        },
        
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
    var content = '';
    content += `
        <div style="padding: 10px; background-color: #003375">
            <div style="padding: 10px; background-color: white;">
                <h4 style="color: #0085ff">Đây là mã OTP để tạo mật khẩu mới</h4>
                <a href="http://127.0.0.1:5500/ASM_ES6/new-pass.html?otp=${otp}&email=${req.body.email}" style="color: blue">${otp}</a>
            </div>
        </div>
    `;
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'NQH-Test nodemailer',
        to: req.body.email,
        subject: 'Test Nodemailer',
        text: 'Your text is here',//Thường thi mình không dùng cái này thay vào đó mình sử dụng html để dễ edit hơn
        html: content //Nội dung html mình đã tạo trên kia :))
    }
    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err);
            req.flash('mess', 'Lỗi gửi mail: '+err); //Gửi thông báo đến người dùng
            res.redirect('/');
        } else {
            console.log('Message sent: ' +  info.response);
            req.flash('mess', 'Một email đã được gửi đến tài khoản của bạn'); //Gửi thông báo đến người dùng
            res.redirect('/');
        }
    });
      // Code for sending email with OTP goes here
  
      res.status(200).send('OTP sent successfully');
    } catch (err) {
      // Handle errors if any
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  };
 
const resetPassword = async (req, res, next) => {
  // Get user information from the request
  const { email, otp, newPassword } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      // User does not exist
      return res.status(400).send('Invalid email');
    }

    // Verify the OTP
    if (user.otp != otp) {
      // Invalid OTP
      return res.status(400).send('Invalid OTP');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    user.otp = null; // Clear the OTP field
    await user.save();

    res.status(200).send('Password reset successful');
  } catch (err) {
    // Handle errors if any
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};
module.exports = { registerUser, loginUser, changePassword , refreshToken, forgotPassword, resetPassword};