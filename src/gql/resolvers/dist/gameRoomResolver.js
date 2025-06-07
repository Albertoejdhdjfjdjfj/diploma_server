"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var GameRoom_1 = require("../../assets/models/GameRoom");
var variables_1 = require("../../assets/variables/variables");
var graphql_subscriptions_1 = require("graphql-subscriptions");
var actionsList_1 = require("../../assets/actions/actionsList");
var pubsub = new graphql_subscriptions_1.PubSub();
var gameRoomResolver = {
    Query: {
        getGameRooms: function (_, args) { return __awaiter(void 0, void 0, Promise, function () {
            var sort, _a, page, _b, limit, skip, regex, games, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        sort = args.sort, _a = args.page, page = _a === void 0 ? 1 : _a, _b = args.limit, limit = _b === void 0 ? 5 : _b;
                        skip = (page - 1) * limit;
                        regex = new RegExp(sort, 'i');
                        return [4 /*yield*/, GameRoom_1.GameRoomModel.find({
                                $or: [
                                    { name: { $regex: regex } },
                                    { "creator.nickname": { $regex: regex } }
                                ]
                            })
                                .skip(skip)
                                .limit(limit)];
                    case 1:
                        games = _c.sent();
                        return [2 /*return*/, games];
                    case 2:
                        error_1 = _c.sent();
                        throw new Error(error_1.message);
                    case 3: return [2 /*return*/];
                }
            });
        }); }
    },
    Mutation: {
        createGameRoom: function (_, args, player) { return __awaiter(void 0, void 0, Promise, function () {
            var name, userGames, newGame, savedGame, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        name = args.name;
                        return [4 /*yield*/, GameRoom_1.GameRoomModel.findOne({ "creator.playerId": player.playerId })];
                    case 1:
                        userGames = _a.sent();
                        if (userGames) {
                            throw new Error('You already have an game room ');
                        }
                        newGame = new GameRoom_1.GameRoomModel({ name: name, creator: { playerId: player.playerId, nickname: player.nickname } });
                        return [4 /*yield*/, newGame.save()];
                    case 2:
                        savedGame = _a.sent();
                        pubsub.publish(actionsList_1.UPDATE_GAME_ROOM, { updatedGameRoom: savedGame });
                        return [2 /*return*/, newGame];
                    case 3:
                        error_2 = _a.sent();
                        throw new Error(error_2.message);
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        joinGameRoom: function (_, args, player) { return __awaiter(void 0, void 0, Promise, function () {
            var id, gameRoom, userGames, joinGames, playerExists, updatedGameRoom, savedGameRoom, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        id = args.id;
                        return [4 /*yield*/, GameRoom_1.GameRoomModel.findById(id)];
                    case 1:
                        gameRoom = _a.sent();
                        if (!gameRoom) {
                            throw new Error("The Game room does not exist");
                        }
                        return [4 /*yield*/, GameRoom_1.GameRoomModel.findOne({
                                "creator.playerId": player.playerId
                            })];
                    case 2:
                        userGames = _a.sent();
                        return [4 /*yield*/, GameRoom_1.GameRoomModel.findOne({
                                "players.playerId": player.playerId
                            })];
                    case 3:
                        joinGames = _a.sent();
                        if (userGames && userGames.id !== gameRoom.id || joinGames) {
                            throw new Error('You already have an active game room');
                        }
                        playerExists = gameRoom.players.some(function (player) { return player.playerId === player.playerId; });
                        if (!playerExists) {
                            throw new Error("You are already in the game room");
                        }
                        if (!(gameRoom.players.length >= variables_1.playersMax)) return [3 /*break*/, 5];
                        gameRoom.observers.push({
                            playerId: player.playerId,
                            nickname: player.nickname
                        });
                        return [4 /*yield*/, gameRoom.save()];
                    case 4:
                        updatedGameRoom = _a.sent();
                        return [2 /*return*/, updatedGameRoom];
                    case 5:
                        gameRoom.players.push({
                            playerId: player.playerId,
                            nickname: player.nickname
                        });
                        return [4 /*yield*/, gameRoom.save()];
                    case 6:
                        savedGameRoom = _a.sent();
                        pubsub.publish(actionsList_1.UPDATE_GAME_ROOM, { updatedGameRoom: savedGameRoom });
                        return [2 /*return*/, savedGameRoom];
                    case 7:
                        error_3 = _a.sent();
                        throw new Error(error_3.message);
                    case 8: return [2 /*return*/];
                }
            });
        }); },
        leaveGameRoom: function (_, args, player) { return __awaiter(void 0, void 0, Promise, function () {
            var id, gameRoom, playerIndex, updatedGameRoom, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        id = args.id;
                        return [4 /*yield*/, GameRoom_1.GameRoomModel.findById(id)];
                    case 1:
                        gameRoom = _a.sent();
                        if (!gameRoom) {
                            throw new Error("The Game room does not exist");
                        }
                        playerIndex = gameRoom.players.findIndex(function (player) { return player.playerId === player.playerId; });
                        if (playerIndex === -1) {
                            playerIndex = gameRoom.observers.findIndex(function (player) { return player.playerId === player.playerId; });
                            if (playerIndex === -1) {
                                throw new Error("You are not in this game room");
                            }
                        }
                        gameRoom.players.splice(playerIndex, 1);
                        return [4 /*yield*/, gameRoom.save()];
                    case 2:
                        updatedGameRoom = _a.sent();
                        pubsub.publish(actionsList_1.UPDATE_GAME_ROOM, { updatedGameRoom: updatedGameRoom });
                        return [2 /*return*/, updatedGameRoom];
                    case 3:
                        error_4 = _a.sent();
                        throw new Error(error_4.message);
                    case 4: return [2 /*return*/];
                }
            });
        }); }
    },
    Subscription: {
        updatedGameRoom: {
            subscribe: function () { return pubsub.asyncIterableIterator(actionsList_1.UPDATE_GAME_ROOM); }
        }
    }
};
module.exports = gameRoomResolver;
