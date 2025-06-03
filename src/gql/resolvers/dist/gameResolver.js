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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var Game_1 = require("../../assets/models/Game");
var GameRoom_1 = require("../../assets/models/GameRoom");
var graphql_subscriptions_1 = require("graphql-subscriptions");
var actionsList_1 = require("../../assets/actions/actionsList");
var decodeToken_1 = require("../../assets/functions/decodeToken");
var filterChat_1 = require("../../assets/functions/filterChat");
var GameAlgorithms_1 = require("../../assets/classes/GameAlgorithms");
var GameCore_1 = require("../../core/GameCore");
var dbController_1 = require("../../assets/classes/dbController");
var PubController_1 = require("../../assets/classes/PubController");
var pubsub = new graphql_subscriptions_1.PubSub();
var gameResolver = {
    Query: {
        getMessages: function (_, args, player) { return __awaiter(void 0, void 0, Promise, function () {
            var gameId, currentGame, playerInGame, playerRole, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        gameId = args.gameId;
                        return [4 /*yield*/, Game_1.GameModel.findById(gameId)];
                    case 1:
                        currentGame = _a.sent();
                        if (!currentGame) {
                            throw new Error("The Game does not exist");
                        }
                        playerInGame = dbController_1.DBController.getPlayerById(currentGame, player.playerId);
                        if (!playerInGame) {
                            throw new Error("You are not player in this game");
                        }
                        playerRole = dbController_1.DBController.getPlayerRoleById(currentGame, player.playerId);
                        if (!playerRole) {
                            return [2 /*return*/, currentGame.chat];
                        }
                        return [2 /*return*/, filterChat_1.filterChat(currentGame.chat, playerRole.name)];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error(error_1.message);
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        getPlayers: function (_, args, player) { return __awaiter(void 0, void 0, Promise, function () {
            var gameId, currentGame, playerInGame, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        gameId = args.gameId;
                        return [4 /*yield*/, Game_1.GameModel.findById(gameId)];
                    case 1:
                        currentGame = _a.sent();
                        if (!currentGame) {
                            throw new Error("The Game does not exist");
                        }
                        playerInGame = dbController_1.DBController.getPlayerById(currentGame, player.playerId);
                        if (!playerInGame) {
                            throw new Error("You are not player in this game");
                        }
                        return [2 /*return*/, { players: currentGame.players, observers: currentGame.observers }];
                    case 2:
                        error_2 = _a.sent();
                        throw new Error(error_2.message);
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        getActiveGame: function (_, args, player) { return __awaiter(void 0, void 0, Promise, function () {
            var currentGame, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Game_1.GameModel.findOne({
                                "players.playerId": player.playerId
                            })];
                    case 1:
                        currentGame = _a.sent();
                        return [2 /*return*/, { gameId: currentGame ? currentGame.id : null }];
                    case 2:
                        error_3 = _a.sent();
                        throw new Error(error_3.message);
                    case 3: return [2 /*return*/];
                }
            });
        }); }
    },
    Mutation: {
        startGame: function (_, args, player) { return __awaiter(void 0, void 0, Promise, function () {
            var id, gameRoom, startedGame, savedGame, error_4;
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
                        if (player.playerId !== gameRoom.creator.playerId) {
                            throw new Error("You are not creator of this game");
                        }
                        startedGame = new Game_1.GameModel({
                            players: __spreadArrays(gameRoom.players),
                            observers: __spreadArrays(gameRoom.observers)
                        });
                        return [4 /*yield*/, startedGame.save()];
                    case 2:
                        savedGame = _a.sent();
                        // await gameRoom.deleteOne();
                        new GameCore_1.GameCore(savedGame, pubsub).game();
                        PubController_1.PubController.pubActiveGame(savedGame, pubsub);
                        return [2 /*return*/, savedGame.id];
                    case 3:
                        error_4 = _a.sent();
                        throw new Error(error_4.message);
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        sendMessage: function (_, args, player) { return __awaiter(void 0, void 0, Promise, function () {
            var content, gameId, currentGame, playerRole, receiver, target, targetId, error_5;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 7, , 8]);
                        content = args.content, gameId = args.gameId;
                        return [4 /*yield*/, Game_1.GameModel.findById(gameId)];
                    case 1:
                        currentGame = _d.sent();
                        if (!currentGame) {
                            throw new Error("The Game does not exist");
                        }
                        playerRole = dbController_1.DBController.getPlayerRoleById(currentGame, player.playerId);
                        if (!playerRole) {
                            throw new Error("You are not player in this game");
                        }
                        if ((playerRole.name !== currentGame.roleInLine && playerRole.player.nickname !== ((_a = currentGame.playerInLine) === null || _a === void 0 ? void 0 : _a.nickname)) || playerRole.player.nickname !== ((_b = currentGame.playerInLine) === null || _b === void 0 ? void 0 : _b.nickname)) {
                            throw new Error("It is not your order to talk");
                        }
                        receiver = GameAlgorithms_1.GameAlgorithms.determineReceiverRole(playerRole.name, currentGame.phase, currentGame.roleInLine);
                        target = GameAlgorithms_1.GameAlgorithms.getWordStartingWithAt(content);
                        if (!target) return [3 /*break*/, 4];
                        targetId = (_c = dbController_1.DBController.getPlayerByName(currentGame, target)) === null || _c === void 0 ? void 0 : _c.playerId;
                        if (!targetId) {
                            throw new Error("Target is not player in this game");
                        }
                        return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, player, receiver, content)];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubMessage(currentGame, pubsub)];
                    case 3:
                        _d.sent();
                        new GameCore_1.GameCore(currentGame, pubsub).game();
                        return [2 /*return*/];
                    case 4: return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, player, receiver, content)];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubMessage(currentGame, pubsub)];
                    case 6:
                        _d.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_5 = _d.sent();
                        throw new Error(error_5.message);
                    case 8: return [2 /*return*/];
                }
            });
        }); }
    },
    Subscription: {
        newMessage: {
            subscribe: graphql_subscriptions_1.withFilter(function () { return pubsub.asyncIterableIterator(actionsList_1.NEW_MESSAGE); }, function (payload, variables) {
                if (!payload) {
                    return false;
                }
                var token = variables.token.split(' ')[1];
                var data = decodeToken_1.decodeToken(token);
                return (data.userId === payload.newMessage.receiverId && variables.gameId === payload.newMessage.gameId);
            })
        },
        activeGame: {
            subscribe: graphql_subscriptions_1.withFilter(function () { return pubsub.asyncIterableIterator(actionsList_1.ACTIVE_GAME); }, function (payload, variables) {
                if (!payload) {
                    return false;
                }
                var token = variables.token.split(' ')[1];
                var data = decodeToken_1.decodeToken(token);
                return (data.userId === payload.activeGame.receiverId);
            })
        }
    }
};
module.exports = gameResolver;
