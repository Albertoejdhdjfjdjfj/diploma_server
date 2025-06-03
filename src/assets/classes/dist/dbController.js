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
exports.DBController = void 0;
var Game_1 = require("../models/Game");
var DBController = /** @class */ (function () {
    function DBController() {
    }
    DBController.updateGame = function (currentGame, errorMessage) {
        if (errorMessage === void 0) { errorMessage = "The Game does not exist"; }
        return __awaiter(this, void 0, Promise, function () {
            var updatedGame;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Game_1.GameModel.findByIdAndUpdate(currentGame.id, currentGame, { "new": true })];
                    case 1:
                        updatedGame = _a.sent();
                        if (!updatedGame) {
                            throw new Error(errorMessage);
                        }
                        return [2 /*return*/, updatedGame];
                }
            });
        });
    };
    DBController.deleteGame = function (currentGame, delay) {
        if (delay === void 0) { delay = 0; }
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Game_1.GameModel.findByIdAndDelete(currentGame.id)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DBController.addMessage = function (currentGame, sender, receiverRole, content, delay) {
        if (delay === void 0) { delay = 0; }
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay); })];
                    case 1:
                        _a.sent();
                        currentGame.chat.push({
                            sender: sender,
                            receiverRole: receiverRole,
                            content: content,
                            phase: currentGame.phase
                        });
                        return [2 /*return*/, DBController.updateGame(currentGame)];
                }
            });
        });
    };
    DBController.setRoles = function (currentGame, roles) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                currentGame.roles = roles;
                return [2 /*return*/, DBController.updateGame(currentGame)];
            });
        });
    };
    DBController.newRound = function (currentGame) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                currentGame.round = currentGame.round + 1;
                return [2 /*return*/, DBController.updateGame(currentGame)];
            });
        });
    };
    DBController.setPlayerInLine = function (currentGame, player) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                currentGame.playerInLine = player;
                return [2 /*return*/, DBController.updateGame(currentGame)];
            });
        });
    };
    DBController.setRoleInLine = function (currentGame, role) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                currentGame.roleInLine = role;
                return [2 /*return*/, DBController.updateGame(currentGame)];
            });
        });
    };
    DBController.setPhase = function (currentGame, phase) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                currentGame.phase = phase;
                return [2 /*return*/, DBController.updateGame(currentGame)];
            });
        });
    };
    DBController.cleanVoting = function (currentGame) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                currentGame.voting = [];
                return [2 /*return*/, DBController.updateGame(currentGame)];
            });
        });
    };
    DBController.addVote = function (currentGame, player) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                currentGame.voting.push(player);
                return [2 /*return*/, DBController.updateGame(currentGame)];
            });
        });
    };
    DBController.deletePlayer = function (currentGame, playerId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                currentGame.roles = currentGame.roles.filter(function (role) { return role.player.playerId !== playerId; });
                currentGame.players = currentGame.players.filter(function (player) { return player.playerId !== playerId; });
                return [2 /*return*/, DBController.updateGame(currentGame)];
            });
        });
    };
    DBController.addPlayerToObservers = function (currentGame, player) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                currentGame.observers.push(player);
                return [2 /*return*/, DBController.updateGame(currentGame)];
            });
        });
    };
    DBController.addAlibi = function (currentGame, playerId) {
        return __awaiter(this, void 0, Promise, function () {
            var playerIndex;
            return __generator(this, function (_a) {
                playerIndex = currentGame.roles.findIndex(function (role) { return role.player.playerId === playerId; });
                if (playerIndex === -1) {
                    throw new Error("There is no such player in the game");
                }
                currentGame.roles[playerIndex].alibi = currentGame.round;
                return [2 /*return*/, DBController.updateGame(currentGame)];
            });
        });
    };
    DBController.getPlayerRoleById = function (currentGame, playerId) {
        var playerRole = currentGame.roles.find(function (role) { return role.player.playerId === playerId; });
        return playerRole;
    };
    DBController.getPlayerById = function (currentGame, playerId) {
        var player = currentGame.players.find(function (pl) { return pl.playerId === playerId; });
        return player;
    };
    DBController.getPlayerByName = function (currentGame, playerName) {
        var player = currentGame.players.find(function (pl) { return pl.nickname === playerName; });
        return player;
    };
    DBController.setCure = function (currentGame, playerId) {
        return __awaiter(this, void 0, Promise, function () {
            var playerIndex;
            return __generator(this, function (_a) {
                playerIndex = currentGame.roles.findIndex(function (role) { return role.player.playerId === playerId; });
                if (playerIndex === -1) {
                    throw new Error("There is no such player in the game");
                }
                currentGame.roles[playerIndex].alive = true;
                currentGame.roles[playerIndex].treated = currentGame.round;
                return [2 /*return*/, DBController.updateGame(currentGame)];
            });
        });
    };
    DBController.setKill = function (currentGame, playerId) {
        return __awaiter(this, void 0, Promise, function () {
            var playerIndex;
            return __generator(this, function (_a) {
                playerIndex = currentGame.roles.findIndex(function (role) { return role.player.playerId === playerId; });
                if (playerIndex === -1) {
                    throw new Error("There is no such player in the game");
                }
                currentGame.roles[playerIndex].alive = false;
                return [2 /*return*/, DBController.updateGame(currentGame)];
            });
        });
    };
    return DBController;
}());
exports.DBController = DBController;
