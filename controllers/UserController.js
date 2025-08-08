const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;
        //Check already exists
        const isAlready = await User.findOne({
            $or: [{name}, {email}]
        });

        if (isAlready) {
            res.status(400).json({
                success: false,
                message: 'User or emial is already exists!'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
            role
        });

        res.status(201).json({
            success: true,
            message: "Register is Successful",
            data: newUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Register Failed",
        });
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            throw new Error('Validation Error');
        }

        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Your password is wrong'
            });
        }

        const accessToken = await jwt.sign({
            userId: user._id,
            userEmail: user.email,
            role: user.role
        }, process.env.JWT_SECRET, {expiresIn: 60 * 60}
        );


        res.status(200).json({
            success: true,
            message: 'Login Successful',
            token: accessToken
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
}

const me = async (req, res) => {
    try {
        const authUser = req.userInfo;

        res.status(200).json({
            success: true,
            data: authUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something Went wrong",
        });
    }
}

module.exports = {register, login, me}