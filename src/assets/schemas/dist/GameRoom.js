"use strict";
exports.__esModule = true;
exports.GameRoomSchema = void 0;
var mongoose_1 = require("mongoose");
var Player_1 = require("./Player");
exports.GameRoomSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    creator: { type: Player_1.PlayerSchema, required: true },
    players: [{ type: Player_1.PlayerSchema, required: true }],
    observers: [{ type: Player_1.PlayerSchema }]
});
