const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const appConfig = require('../config/myapp');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const resolvers = {
    Query: {
        getMe: asyncHandler(async (_, {id}) => {
            const user = await User.findById({_id: id});
            if (!user) throw new Error('User not exists');

            return user;
        })
    },
    Mutation: {
        register: asyncHandler(async (_, {input}) => {
            const {name, email, password, role} = input;

            if (!name || !email || !password) throw new Error('Validation Errors');

            //Check already exists
            const user = await User.findOne({$or: [{name}, {email}]});

            if (user) throw new Error('User already exists!.');

            const salt = await bcrypt.genSalt(appConfig.hashLength);
            const hashPassword = await bcrypt.hash(password, salt);

            const newUser = await User.create({
                name,
                email,
                password: hashPassword,
                role
            });

            return newUser;
        }),
        login: asyncHandler(async (_, {input}) => {
            const {email, password} = input;

            if (!email || !password) throw new Error('Validation Errors');

            const user = await User.findOne({email});

            if (!user) throw new Error('User not exists');

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) throw new Error('Password is not correct');

            const token = await jwt.sign({
                userId: user._id,
                userEmail: user.email,
                role: user.role
            }, process.env.JWT_SECRET, {expiresIn: 60 * 60}
            );

            return {
                token,
                user,
                message:"Login Sucessful"
            };
        })


    }
}

module.exports = resolvers;