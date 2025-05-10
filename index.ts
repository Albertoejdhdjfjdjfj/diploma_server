import express, { Express } from "express";
const http = require('http');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
import { execute,subscribe } from "graphql";
import { SubscriptionServer } from 'subscriptions-transport-ws'
const { makeExecutableSchema } = require('@graphql-tools/schema');
const mongoose = require('mongoose');
 

require('dotenv').config();
const PORT = process.env.PORT;
const LINK_DATABASE = process.env.LINK_DATABASE;

const typeDefs = require('./src/assets/schemas/typeDefs');
const resolvers = require('./src/gql/resolvers/index');
const context = require('./src/gql/middleware/auth')

const app: Express = express();

app.use(cors({
    origin: '*'
}));
app.use(express.json());
 
const httpServer = http.createServer(app);

const schema = makeExecutableSchema({ typeDefs, resolvers });

 const server = new ApolloServer({ 
    schema,
    plugins: [{
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close()
            }
          }
        }
    }],
    context:context,
    engine: false,
    formatError: (error:Error) => {
        return new Error(error.message);
    },
 });

 const subscriptionServer = SubscriptionServer.create({
     schema,
     execute,
     subscribe
 }, {
     server: httpServer,
     path: '/subscriptions',
 });

const start = async () => {
    try {
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