const { gql } = require('graphql-tag');

const authTypeDefs = gql`
    type User{
        id:ID!
        name:String!
        email:String!
        password:String!
        role:String
    }
    
    type Query{
        getMe(id:ID!):User! 
    }
    
    input registerInput {
        name: String!
        email: String!
        password: String!
        role:String
    }

    input loginInput{
        email:String!
        password:String!
    }

    type authPayload{
        user:User!
        token:String!
        message:String!
    }

    type Mutation{
        register(input:registerInput!): User!
        login(input:loginInput):authPayload!
    }
`;

module.exports = authTypeDefs;