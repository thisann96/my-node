require("dotenv").config();
const {ApolloServer} = require("@apollo/server");
const {startStandaloneServer} = require("@apollo/server/standalone");
const connectDB = require('./database/db');
const typeDefs = require('./graphql/authSchema');
const resolvers = require('./graphql/authResolvers');

connectDB();

async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    const {url} = await startStandaloneServer(server, {listen: {port: 4000}});

    console.log(`Server ready at ${url}`);
}

startServer();

