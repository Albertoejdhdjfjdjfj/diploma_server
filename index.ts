import express, { Express,Request,Response,NextFunction } from "express";
require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose')
const PORT = process.env.PORT;
const LINK_DATABASE = process.env.LINK_DATABASE;
const app:Express = express(); 

console.log( process.env.PORT)
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

const start = async()=> {
     try{
          mongoose.connect(LINK_DATABASE).then(() => {
          console.log('Connected to MongoDB');
     }).catch((err:Error) => {
        console.error('Error connecting to MongoDB', err);
     });
          app.listen(PORT,()=>console.log(`server started on port ${PORT}`));
          
     }
     catch(e){  
          console.log(e)    
     }
}

start()


