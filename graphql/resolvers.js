const User = require('../models/UserModel');

const resolvers = {
    Query: {
        users: async () => await User.find(),
        user: async (_, {id}) => await User.findById({_id: id})
    },
    Mutation: {
        createUser: async (_, {name, email, password, role}) => await User.create({
            name,
            email,
            password,
            role
        }),
        updateUser: async (_, {id, ...updates}) => await User.findByIdAndUpdate(
            id,
            updates,
            {new: true}
        )
    }
};

module.exports = resolvers;