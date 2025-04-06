import express, { Express } from "express";
const http = require('http');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const { WebSocketServer } = require('ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { useServer } = require('graphql-ws/use/ws');
const mongoose = require('mongoose');

require('dotenv').config();
const PORT = process.env.PORT;
const LINK_DATABASE = process.env.LINK_DATABASE;

const typeDefs = require('./src/assets/schemas/typeDefs');
const resolvers = require('./src/gql/resolvers/index');
const context = require('./src/gql/middleware/auth')

const app: Express = express();

app.use(cors());
app.use(express.json());
 
const httpServer = http.createServer(app);

const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
});

const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new ApolloServer({ 
    schema,
    context:context,
    formatError: (error:Error) => {
        return new Error(error.message);
    },
 });

const start = async () => {
    try {
        useServer({ schema }, wsServer);
        
        await server.start();
        server.applyMiddleware({ app }); 

        await mongoose.connect(LINK_DATABASE);
        console.log('Connected to MongoDB');

        httpServer.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
            console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
        });
    } catch (e) {  
        console.error(e);
    }
}

start();