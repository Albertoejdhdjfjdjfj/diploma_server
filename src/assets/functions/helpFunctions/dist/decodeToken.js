"use strict";
exports.__esModule = true;
exports.decodeToken = void 0;
var jwt = require('jsonwebtoken');
require('dotenv').config();
var ACCESS_SECRET = process.env.ACCESS_SECRET;
function decodeToken(token) {
    var decoded = jwt.verify(token, ACCESS_SECRET);
    return decoded;
}
exports.decodeToken = decodeToken;
