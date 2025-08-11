const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {responseSuccess, responseFail} = require('../helpers/responseHelper');
const appConfig = require('../config/myapp');
const asyncHandler = require('express-async-handler');

const register = asyncHandler(async (req, res) => {

    const {name, email, password, role} = req.body;

    if (!name || !email) responseFail(res, "User or email is empty!", 400);

    //Check already exists
    const isAlready = await User.findOne({
        $or: [{name}, {email}]
    });

    if (isAlready) {
        responseFail(res, "User or email is already exists!", 400);
    }

    const salt = await bcrypt.genSalt(appConfig.hashLength);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        name,
        email,
        password: hashPassword,
        role
    });

    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    responseSuccess(res, userWithoutPassword, 'Register Successful', 201);

});

const login = asyncHandler(async (req, res) => {

    const {email, password} = req.body;

    if (!email || !password) responseFail(res, "Validation Error", 400);

    const user = await User.findOne({email});

    if (!user) responseFail(res, "Invalid credentials", 400);

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) responseFail(res, "Your password is wrong", 400);

    const accessToken = await jwt.sign({
        userId: user._id,
        userEmail: user.email,
        role: user.role
    }, process.env.JWT_SECRET, {expiresIn: 60 * 60}
    );

    responseSuccess(res, accessToken, 'Login Successful', 200);

});

const me = asyncHandler(async (req, res) => {

    const authUser = req.userInfo;

    responseSuccess(res, authUser, 'Get Me', 200);

});

module.exports = {register, login, me}