import { decodeToken } from "../../assets/functions/helpFunctions/decodeToken";
import { Request } from "express";
import { Player } from "../../assets/interfaces/Player";
import { DecodedToken } from "../../assets/interfaces/DecodedToken";

module.exports = async (context: {req:Request}):Promise<Player|void> => {
     const token:string|undefined = context.req.headers.authorization; 
 
     if (context.req.body.query.includes('userLogIn')||
        context.req.body.query.includes('getGameRooms')||
        context.req.body.query.includes('getUserInfo') 
        ) {
         return
     }
 
     if (!token) {
         throw new Error('Authorization header is missing');
     }
 
     try {
         const data:DecodedToken = decodeToken(token)
         return {nickname:data.nickname,playerId:data.userId};
     } catch (error) {
             throw new Error('Incorrect access token');
     }
 };