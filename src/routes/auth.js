const express = require('express');
const Router = express();
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../middlewares/validation');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require('dotenv/config');
 
Router.post('/register', async(req, res) => {
    // Validate the data before create a user
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if phone exists
    const phoneExist = await User.findOne({ phone: req.body.userPhone });
    if (phoneExist) return res.status(400).send('Phone number already exists');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.userPassword, salt);

    const user = new User({
        name: req.body.userName,
        phone: req.body.userPhone,
        password: hashPassword,
        pushToken: req.body.userPushToken
    });

    try {
        const savedUser = await user.save();
        res.send({ type: 'Registered', user: savedUser })
    } catch (error) {
        console.error(error);
    };

    
});

Router.post('/login', async (req, res) => {
    // Validate the data before login
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    //Check if the email exists
    const user = await User.findOne({ phone: req.body.userPhone});
    if (!user) return res.status(400).send('Phone Number is not found');
    
    // Password is correct
    const validPass = await bcrypt.compare(req.body.userPassword, user.password);
    if (!validPass) return res.status(400).send('Invalid Password');

    // Create and assign a token
    const token = jwt.sign({ _id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({ msg: "Login Successfuly", user: user, token: token });

    // res.send({ type: "Login Successfuly", user: req.user, token: token });
});

const verify = require('../middlewares/verifyToken');

Router.get('/', verify, (req, res) => {
    res.send({
        posts: {
            title: "my first post",
            description: "random data you shouldn't access"
        },
        user: req.user
    })
})

module.exports = Router;