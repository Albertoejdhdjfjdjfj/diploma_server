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
exports.SelectionController = void 0;
var GamePhase_1 = require("../enums/GamePhase");
var dbController_1 = require("./dbController");
var Roles_1 = require("../enums/Roles");
var PubController_1 = require("./PubController");
var SelectionController = /** @class */ (function () {
    function SelectionController() {
    }
    ;
    SelectionController.loverSelection = function (currentGame, playerRole, targetRole, pubsub) {
        return __awaiter(this, void 0, Promise, function () {
            var mafiaPlayers, _i, mafiaPlayers_1, mafiaRole, mafiaPlayers, _a, mafiaPlayers_2, mafiaRole;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!targetRole) {
                            throw new Error("You have to choose");
                        }
                        if (targetRole.name === Roles_1.Roles.LOVER || targetRole.player.playerId === playerRole.player.playerId) {
                            throw new Error("You can not choose yourself or sameone with the same role");
                        }
                        if ((targetRole.alibi === currentGame.round - 1) && (targetRole.alibi - 1 > 0)) {
                            throw new Error("You can not choose one player 2 times in a row.");
                        }
                        if (!(currentGame.phase === GamePhase_1.GamePhase.NIGHT)) return [3 /*break*/, 16];
                        if (!(targetRole.name === Roles_1.Roles.MAFIA)) return [3 /*break*/, 6];
                        mafiaPlayers = currentGame.roles.filter(function (role) { return (role.name === Roles_1.Roles.MAFIA); });
                        _i = 0, mafiaPlayers_1 = mafiaPlayers;
                        _b.label = 1;
                    case 1:
                        if (!(_i < mafiaPlayers_1.length)) return [3 /*break*/, 4];
                        mafiaRole = mafiaPlayers_1[_i];
                        return [4 /*yield*/, dbController_1.DBController.addAlibi(currentGame, mafiaRole.player.playerId)];
                    case 2:
                        currentGame = _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, playerRole.player, Roles_1.Roles.LOVER, targetRole.player.nickname)];
                    case 5:
                        currentGame = _b.sent();
                        return [3 /*break*/, 15];
                    case 6:
                        if (!(targetRole.name === Roles_1.Roles.DON)) return [3 /*break*/, 12];
                        mafiaPlayers = currentGame.roles.filter(function (role) { return (role.name === Roles_1.Roles.MAFIA) || (role.name === Roles_1.Roles.DON); });
                        _a = 0, mafiaPlayers_2 = mafiaPlayers;
                        _b.label = 7;
                    case 7:
                        if (!(_a < mafiaPlayers_2.length)) return [3 /*break*/, 10];
                        mafiaRole = mafiaPlayers_2[_a];
                        return [4 /*yield*/, dbController_1.DBController.addAlibi(currentGame, mafiaRole.player.playerId)];
                    case 8:
                        currentGame = _b.sent();
                        _b.label = 9;
                    case 9:
                        _a++;
                        return [3 /*break*/, 7];
                    case 10: return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, playerRole.player, Roles_1.Roles.LOVER, targetRole.player.nickname)];
                    case 11:
                        currentGame = _b.sent();
                        return [3 /*break*/, 15];
                    case 12: return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, playerRole.player, Roles_1.Roles.LOVER, targetRole.player.nickname)];
                    case 13:
                        currentGame = _b.sent();
                        return [4 /*yield*/, dbController_1.DBController.addAlibi(currentGame, targetRole.player.playerId)];
                    case 14:
                        currentGame = _b.sent();
                        _b.label = 15;
                    case 15: return [3 /*break*/, 19];
                    case 16: return [4 /*yield*/, dbController_1.DBController.addVote(currentGame, targetRole.player)];
                    case 17:
                        currentGame = _b.sent();
                        return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, playerRole.player, Roles_1.Roles.ALL, targetRole.player.nickname)];
                    case 18:
                        currentGame = _b.sent();
                        _b.label = 19;
                    case 19: return [4 /*yield*/, PubController_1.PubController.pubMessage(currentGame, pubsub)];
                    case 20:
                        _b.sent();
                        return [2 /*return*/, currentGame];
                }
            });
        });
    };
    SelectionController.mafiaSelection = function (currentGame, playerRole, targetRole, pubsub) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!targetRole) {
                            throw new Error("You have to choose");
                        }
                        if (targetRole.name === Roles_1.Roles.MAFIA || targetRole.player.playerId === playerRole.player.playerId) {
                            throw new Error("You can not choose yourself or sameone with the same role");
                        }
                        return [4 /*yield*/, dbController_1.DBController.addVote(currentGame, targetRole.player)];
                    case 1:
                        currentGame = _a.sent();
                        if (!(currentGame.phase === GamePhase_1.GamePhase.NIGHT)) return [3 /*break*/, 3];
                        return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, playerRole.player, Roles_1.Roles.MAFIA, targetRole.player.nickname)];
                    case 2:
                        currentGame = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, playerRole.player, Roles_1.Roles.ALL, targetRole.player.nickname)];
                    case 4:
                        currentGame = _a.sent();
                        _a.label = 5;
                    case 5: return [4 /*yield*/, PubController_1.PubController.pubMessage(currentGame, pubsub)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, currentGame];
                }
            });
        });
    };
    SelectionController.donSelection = function (currentGame, playerRole, targetRole, pubsub) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!targetRole) {
                            throw new Error("You have to choose");
                        }
                        if (targetRole.name === Roles_1.Roles.MAFIA || targetRole.name === Roles_1.Roles.DON || targetRole.player.playerId === playerRole.player.playerId) {
                            throw new Error("You can not choose yourself or sameone with the same role");
                        }
                        if (!(currentGame.roleInLine === Roles_1.Roles.DON)) return [3 /*break*/, 6];
                        return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, playerRole.player, Roles_1.Roles.DON, targetRole.player.nickname)];
                    case 1:
                        currentGame = _a.sent();
                        if (!(targetRole.name === Roles_1.Roles.SHERIFF)) return [3 /*break*/, 3];
                        return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.DON, "Yes," + targetRole.player.nickname + " is sheriff")];
                    case 2:
                        currentGame = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.DON, "No," + targetRole.player.nickname + " is not sheriff")];
                    case 4:
                        currentGame = _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 11];
                    case 6: return [4 /*yield*/, dbController_1.DBController.addVote(currentGame, targetRole.player)];
                    case 7:
                        currentGame = _a.sent();
                        if (!(currentGame.phase === GamePhase_1.GamePhase.NIGHT)) return [3 /*break*/, 9];
                        return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, playerRole.player, Roles_1.Roles.MAFIA, targetRole.player.nickname)];
                    case 8:
                        currentGame = _a.sent();
                        return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, playerRole.player, Roles_1.Roles.ALL, targetRole.player.nickname)];
                    case 10:
                        currentGame = _a.sent();
                        _a.label = 11;
                    case 11: return [4 /*yield*/, PubController_1.PubController.pubMessage(currentGame, pubsub)];
                    case 12:
                        _a.sent();
                        return [2 /*return*/, currentGame];
                }
            });
        });
    };
    SelectionController.sheriffSelection = function (currentGame, playerRole, targetRole, pubsub) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!targetRole) {
                            throw new Error("You have to choose");
                        }
                        if (targetRole.name === Roles_1.Roles.SHERIFF || targetRole.player.playerId === playerRole.player.playerId) {
                            throw new Error("You can not choose yourself or sameone with the same role");
                        }
                        if (!(currentGame.phase === GamePhase_1.GamePhase.NIGHT)) return [3 /*break*/, 6];
                        return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, playerRole.player, Roles_1.Roles.SHERIFF, targetRole.player.nickname)];
                    case 1:
                        currentGame = _a.sent();
                        if (!(targetRole.name === Roles_1.Roles.MAFIA || targetRole.name === Roles_1.Roles.DON)) return [3 /*break*/, 3];
                        return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.SHERIFF, "Yes," + targetRole.player.nickname + " is mafia")];
                    case 2:
                        currentGame = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.SHERIFF, "No," + targetRole.player.nickname + " is not mafia")];
                    case 4:
                        currentGame = _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 9];
                    case 6: return [4 /*yield*/, dbController_1.DBController.addVote(currentGame, targetRole.player)];
                    case 7:
                        currentGame = _a.sent();
                        return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, playerRole.player, Roles_1.Roles.ALL, targetRole.player.nickname)];
                    case 8:
                        currentGame = _a.sent();
                        _a.label = 9;
                    case 9: return [4 /*yield*/, PubController_1.PubController.pubMessage(currentGame, pubsub)];
                    case 10:
                        _a.sent();
                        return [2 /*return*/, currentGame];
                }
            });
        });
    };
    SelectionController.doctorSelection = function (currentGame, playerRole, targetRole, pubsub) {
        return __awaiter(this, void 0, Promise, function () {
            var targetRoleLover;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!targetRole) {
                            throw new Error("You have to choose");
                        }
                        if (!(currentGame.phase === GamePhase_1.GamePhase.NIGHT)) return [3 /*break*/, 5];
                        if (targetRole.name === Roles_1.Roles.DOCTOR && targetRole.treated) {
                            throw new Error("You are was treated");
                        }
                        if (targetRole.treated == currentGame.round - 1) {
                            throw new Error("You can not heal one player 2 times in a row");
                        }
                        if (!(targetRole.name === Roles_1.Roles.LOVER)) return [3 /*break*/, 2];
                        targetRoleLover = currentGame.roles.find(function (role) { return role.alibi === currentGame.round; });
                        if (!targetRoleLover) return [3 /*break*/, 2];
                        return [4 /*yield*/, dbController_1.DBController.setCure(currentGame, targetRoleLover.player.playerId)];
                    case 1:
                        currentGame = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, dbController_1.DBController.setCure(currentGame, targetRole.player.playerId)];
                    case 3:
                        currentGame = _a.sent();
                        return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, playerRole.player, Roles_1.Roles.DOCTOR, targetRole.player.nickname)];
                    case 4:
                        currentGame = _a.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        currentGame.voting.push(targetRole.player);
                        return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, playerRole.player, Roles_1.Roles.ALL, targetRole.player.nickname)];
                    case 6:
                        currentGame = _a.sent();
                        _a.label = 7;
                    case 7: return [4 /*yield*/, PubController_1.PubController.pubMessage(currentGame, pubsub)];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, currentGame];
                }
            });
        });
    };
    SelectionController.maniakSelection = function (currentGame, playerRole, targetRole, pubsub) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!targetRole && currentGame.phase === GamePhase_1.GamePhase.NIGHT)) return [3 /*break*/, 2];
                        return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, playerRole.player, Roles_1.Roles.MANIAC, "I do not choose anyone.")];
                    case 1:
                        currentGame = _a.sent();
                        return [3 /*break*/, 8];
                    case 2:
                        if (!targetRole) {
                            throw new Error("You have to choose");
                        }
                        if (targetRole.name === Roles_1.Roles.MANIAC || targetRole.player.playerId === playerRole.player.playerId) {
                            throw new Error("You can not choose yourself or sameone with the same role");
                        }
                        if (!(currentGame.phase === GamePhase_1.GamePhase.NIGHT)) return [3 /*break*/, 5];
                        return [4 /*yield*/, dbController_1.DBController.setKill(currentGame, targetRole.player.playerId)];
                    case 3:
                        currentGame = _a.sent();
                        return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, playerRole.player, Roles_1.Roles.MANIAC, targetRole.player.nickname)];
                    case 4:
                        currentGame = _a.sent();
                        return [3 /*break*/, 8];
                    case 5: return [4 /*yield*/, dbController_1.DBController.addVote(currentGame, targetRole.player)];
                    case 6:
                        currentGame = _a.sent();
                        return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, playerRole.player, Roles_1.Roles.ALL, targetRole.player.nickname)];
                    case 7:
                        currentGame = _a.sent();
                        _a.label = 8;
                    case 8: return [4 /*yield*/, PubController_1.PubController.pubMessage(currentGame, pubsub)];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, currentGame];
                }
            });
        });
    };
    return SelectionController;
}());
exports.SelectionController = SelectionController;
