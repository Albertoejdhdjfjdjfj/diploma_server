const jwt = require('jsonwebtoken');

require('dotenv').config();
const ACCESS_SECRET = process.env.ACCESS_SECRET;

export function decodeToken(token:String):any{
     if (!token) {
          throw new Error('Authorization header is missing');
     }

     const decoded = jwt.verify(token.split(' ')[1], ACCESS_SECRET);
     return decoded
}