const { gql } = require('graphql-tag');

const typeDefs = gql`
    type User {
        id:ID!
        name:String!
        email:String!
        role:String!
    }

    type Query {
        users: [User!]!
        user(id : ID!): User
    }

    type Mutation {
        createUser(
            name:String!
            email:String!
            password:String!
            role:String
        ): User
        updateUser(
            id:ID!
            name:String!
            email:String
            role:String
        ):User
    }
`;

module.exports = typeDefs;