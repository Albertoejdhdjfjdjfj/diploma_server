import { Request,Response } from "express";
const jwt = require('jsonwebtoken');

require('dotenv').config();
const ACCESS_SECRET = process.env.ACCESS_SECRET;

module.exports = async (context: any) => {
     const authHeader = context.req.headers.authorization; 
 
     if (context.req.body.query.includes('userLogIn')||
        context.req.body.query.includes('getGameRooms')||
        context.req.body.query.includes('getUserInfo') 
        ) {
         return context;
     }
 
     if (!authHeader) {
         throw new Error('Authorization header is missing');
     }
 
     const token = authHeader.split(' ')[1];
 
     try {
         const decoded = jwt.verify(token, ACCESS_SECRET);
         context.user = decoded;
         return context;
     } catch (error) {
             throw new Error('Incorrect access token');
     }
 };