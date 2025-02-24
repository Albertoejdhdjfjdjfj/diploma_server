import express, { Express,Request,Response,NextFunction } from "express";
const http = require('http');
const cors = require('cors');
const {ApolloServer}= require('apollo-server-express');
const {WebSocketServer} = require('ws');
const {makeExecutableSchema} = require('@graphql-tools/schema');
const { useServer } = require('graphql-ws/use/ws')
const mongoose = require('mongoose')

require('dotenv').config()
const PORT = process.env.PORT;
const LINK_DATABASE = process.env.LINK_DATABASE;

const typeDefs = require('./src/gql/typeDefs');
const resolvers = require('./src/gql/resolvers')

const app:Express = express(); 

app.use((req: Request, res: Response, next: NextFunction) => {
     res.header("Access-Control-Allow-Origin", "*");
     res.header(
       "Access-Control-Allow-Methods",
       "GET, PUT, POST, DELETE, OPTIONS"
     );
     res.header(
       "Access-Control-Allow-Headers",
       "Origin, X-Requested-With, Content-Type, Accept, Authorization"
     );
     next();
   });
   
   app.use(cors())
   app.use(express.json()); 

const httpServer = http.createServer(app)

const wsServer = new WebSocketServer({
     server:httpServer,
     path:'gql'
})
 

const schema = makeExecutableSchema({typeDefs,resolvers});
const server = new ApolloServer({schema})

const start = async()=> {
     try{
          useServer({schema},wsServer);
          await server.start();
          
          mongoose.connect(LINK_DATABASE).then(() => {
          console.log('Connected to MongoDB');
          }).catch((err:Error) => {
            console.error('Error connecting to MongoDB', err);
          });

          httpServer.listen(PORT,()=>console.log(`server started on port ${PORT}`));
     }
     catch(e){  
          console.log(e)    
     }
}

start()


