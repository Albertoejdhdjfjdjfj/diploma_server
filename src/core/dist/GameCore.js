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
exports.GameCore = void 0;
var GamePhase_1 = require("../assets/enums/GamePhase");
var Roles_1 = require("../assets/enums/Roles");
var dbController_1 = require("../assets/classes/dbController");
var PubController_1 = require("../assets/classes/PubController");
var distributeRoles_1 = require("../assets/functions/gameFunctions/distributeRoles");
var nextRole_1 = require("../assets/functions/gameFunctions/nextRole");
var nextPlayer_1 = require("../assets/functions/gameFunctions/nextPlayer");
var determinateKilled_1 = require("../assets/functions/gameFunctions/determinateKilled");
var GameCore = /** @class */ (function () {
    function GameCore(currentGame, pubsub) {
        this.currentGame = currentGame;
        this.pubsub = pubsub;
    }
    GameCore.prototype.game = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.currentGame.round) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.startNewRound()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(this.currentGame.phase === GamePhase_1.GamePhase.NIGHT)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.nightPhase()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!(this.currentGame.phase === GamePhase_1.GamePhase.DAY && !this.currentGame.role && !this.currentGame.player)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.dayPhase()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!(this.currentGame.phase === GamePhase_1.GamePhase.VOTING && !this.currentGame.role && !this.currentGame.player)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.votingPhase()];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    GameCore.prototype.startNewRound = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!!this.currentGame.round) return [3 /*break*/, 5];
                        _a = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, "Hello everyone, the game has started and you will be assigned the appropriate role", GamePhase_1.GamePhase.VOTING, false)];
                    case 1:
                        _a.currentGame = _f.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubMessage(this.currentGame, this.pubsub)];
                    case 2:
                        _f.sent();
                        _b = this;
                        return [4 /*yield*/, dbController_1.DBController.setRoles(this.currentGame, distributeRoles_1.distributeRoles(this.currentGame.players))];
                    case 3:
                        _b.currentGame = _f.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubRoles(this.currentGame, this.pubsub)];
                    case 4:
                        _f.sent();
                        _f.label = 5;
                    case 5:
                        _c = this;
                        return [4 /*yield*/, dbController_1.DBController.newRound(this.currentGame)];
                    case 6:
                        _c.currentGame = _f.sent();
                        _d = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, "Round " + this.currentGame.round, GamePhase_1.GamePhase.VOTING, false)];
                    case 7:
                        _d.currentGame = _f.sent();
                        _e = this;
                        return [4 /*yield*/, dbController_1.DBController.setPhase(this.currentGame, GamePhase_1.GamePhase.NIGHT)];
                    case 8:
                        _e.currentGame = _f.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubMessage(this.currentGame, this.pubsub)];
                    case 9:
                        _f.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GameCore.prototype.nightPhase = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _a, currentRole, nextRoleInLine, _b, _c, _d, nextPlayerInLine, _e, _f, _g, candiateRole, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        if (!(this.currentGame.role === Roles_1.Roles.NOBODY &&
                            this.currentGame.player === Roles_1.Roles.NOBODY)) return [3 /*break*/, 3];
                        _a = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, "The city is falling asleep", GamePhase_1.GamePhase.NIGHT, false)];
                    case 1:
                        _a.currentGame = _j.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubMessage(this.currentGame, this.pubsub)];
                    case 2:
                        _j.sent();
                        _j.label = 3;
                    case 3:
                        currentRole = this.currentGame.role;
                        nextRoleInLine = nextRole_1.nextRole(this.currentGame);
                        _b = this;
                        return [4 /*yield*/, dbController_1.DBController.setRole(this.currentGame, nextRoleInLine)];
                    case 4:
                        _b.currentGame = _j.sent();
                        if (!(nextRoleInLine === Roles_1.Roles.NOBODY)) return [3 /*break*/, 7];
                        _c = this;
                        return [4 /*yield*/, dbController_1.DBController.setPhase(this.currentGame, GamePhase_1.GamePhase.DAY)];
                    case 5:
                        _c.currentGame = _j.sent();
                        _d = this;
                        return [4 /*yield*/, dbController_1.DBController.setPlayer(this.currentGame, Roles_1.Roles.NOBODY)];
                    case 6:
                        _d.currentGame = _j.sent();
                        _j.label = 7;
                    case 7:
                        nextPlayerInLine = nextPlayer_1.nextPlayer(this.currentGame);
                        if (!(nextPlayerInLine === Roles_1.Roles.NOBODY)) return [3 /*break*/, 9];
                        _e = this;
                        return [4 /*yield*/, dbController_1.DBController.cleanVoting(this.currentGame)];
                    case 8:
                        _e.currentGame = _j.sent();
                        _j.label = 9;
                    case 9:
                        _f = this;
                        return [4 /*yield*/, dbController_1.DBController.setPlayer(this.currentGame, nextPlayerInLine)];
                    case 10:
                        _f.currentGame = _j.sent();
                        if (!(currentRole !== nextRoleInLine)) return [3 /*break*/, 13];
                        _g = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, "The " + nextRoleInLine + " is waking up", GamePhase_1.GamePhase.NIGHT, false)];
                    case 11:
                        _g.currentGame = _j.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubMessage(this.currentGame, this.pubsub)];
                    case 12:
                        _j.sent();
                        _j.label = 13;
                    case 13:
                        candiateRole = this.currentGame.roles.find(function (role) { return role.name === nextRoleInLine; });
                        if (!(candiateRole && (candiateRole.alibi === this.currentGame.round))) return [3 /*break*/, 15];
                        _h = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, candiateRole.name, "You are blocked, your lover chose you", GamePhase_1.GamePhase.NIGHT, false)];
                    case 14:
                        _h.currentGame = _j.sent();
                        this.nightPhase();
                        _j.label = 15;
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    GameCore.prototype.dayPhase = function () {
        return __awaiter(this, void 0, Promise, function () {
            var killed, _a, _b, _i, killed_1, role, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        killed = determinateKilled_1.determinateKilled(this.currentGame);
                        if (!killed.length) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, "That night, " + killed.toString() + " were killed", GamePhase_1.GamePhase.DAY, false)];
                    case 1:
                        _a.currentGame = _f.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        _b = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, "No one was killed that night", GamePhase_1.GamePhase.DAY, false)];
                    case 3:
                        _b.currentGame = _f.sent();
                        _f.label = 4;
                    case 4:
                        _i = 0, killed_1 = killed;
                        _f.label = 5;
                    case 5:
                        if (!(_i < killed_1.length)) return [3 /*break*/, 9];
                        role = killed_1[_i];
                        _c = this;
                        return [4 /*yield*/, dbController_1.DBController.deletePlayer(this.currentGame, role.user.playerId)];
                    case 6:
                        _c.currentGame = _f.sent();
                        _d = this;
                        return [4 /*yield*/, dbController_1.DBController.addPlayerToObservers(this.currentGame, role.user)];
                    case 7:
                        _d.currentGame = _f.sent();
                        _f.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 5];
                    case 9:
                        _e = this;
                        return [4 /*yield*/, dbController_1.DBController.setPhase(this.currentGame, GamePhase_1.GamePhase.VOTING)];
                    case 10:
                        _e.currentGame = _f.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GameCore.prototype.votingPhase = function () {
        return __awaiter(this, void 0, Promise, function () {
            var nextPlayerInLine, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        nextPlayerInLine = nextPlayer_1.nextPlayer(this.currentGame);
                        _a = this;
                        return [4 /*yield*/, dbController_1.DBController.setPlayer(this.currentGame, nextPlayerInLine)];
                    case 1:
                        _a.currentGame = _d.sent();
                        if (!(nextPlayerInLine === Roles_1.Roles.NOBODY)) return [3 /*break*/, 4];
                        _b = this;
                        return [4 /*yield*/, dbController_1.DBController.setPhase(this.currentGame, GamePhase_1.GamePhase.NIGHT)];
                    case 2:
                        _b.currentGame = _d.sent();
                        return [4 /*yield*/, this.startNewRound()];
                    case 3:
                        _d.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        _c = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, nextPlayer_1.nextPlayer + " votes", GamePhase_1.GamePhase.NIGHT, false)];
                    case 5:
                        _c.currentGame = _d.sent();
                        _d.label = 6;
                    case 6: return [4 /*yield*/, PubController_1.PubController.pubMessage(this.currentGame, this.pubsub)];
                    case 7:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return GameCore;
}());
exports.GameCore = GameCore;
