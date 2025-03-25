import { decodeToken } from "../../assets/functions/decodeToken";
module.exports = async (context: any) => {
     const token = context.req.headers.authorization; 
 
     if (context.req.body.query.includes('userLogIn')||
        context.req.body.query.includes('getGameRooms')||
        context.req.body.query.includes('getUserInfo') 
        ) {
         return context;
     }
 
     if (!token) {
         throw new Error('Authorization header is missing');
     }
 
     try {
         const decoded = decodeToken(token)
         context.user = decoded;
         return context;
     } catch (error) {
             throw new Error('Incorrect access token');
     }
 };