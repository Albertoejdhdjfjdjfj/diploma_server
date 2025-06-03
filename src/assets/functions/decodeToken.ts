import { DecodedToken } from "../interfaces/DecodedToken";

const jwt = require('jsonwebtoken');

require('dotenv').config();
const ACCESS_SECRET = process.env.ACCESS_SECRET;

export function decodeToken(token:string):DecodedToken{
     const decoded:DecodedToken = jwt.verify(token, ACCESS_SECRET);
     return decoded
}