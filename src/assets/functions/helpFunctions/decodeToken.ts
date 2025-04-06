import { DecodedToken } from "../../interfaces/DecodedToken";

const jwt = require('jsonwebtoken');

require('dotenv').config();
const ACCESS_SECRET = process.env.ACCESS_SECRET;

export function decodeToken(token:String):DecodedToken{
     const decoded:DecodedToken = jwt.verify(token.split(' ')[1], ACCESS_SECRET);
     return decoded
}