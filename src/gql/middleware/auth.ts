import { decodeToken } from "../../assets/functions/decodeToken";
import { Request } from "express";
import { Player } from "../../assets/interfaces/Player";
import { DecodedToken } from "../../assets/interfaces/DecodedToken";

export const context = async (context: {req:Request}):Promise<Player|void> => {
    const authHeader = context.req.headers.authorization; 
    if (context.req.body.query.includes('userLogIn')||
        context.req.body.query.includes('userSignUp')||
       context.req.body.query.includes('getGameRooms')||
       context.req.body.query.includes('getUserInfo') 
       ) {
        return;
    }

    if (!authHeader) {
        throw new Error('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
 
     try {
         const data:DecodedToken = decodeToken(token);
         return {nickname:data.nickname,playerId:data.userId};
     } catch (error) {
             throw new Error('Incorrect access token');
     }
 };