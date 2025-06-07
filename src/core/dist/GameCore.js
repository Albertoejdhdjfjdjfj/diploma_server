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
var GameAlgorithms_1 = require("../assets/classes/GameAlgorithms");
var variables_1 = require("../assets/variables/variables");
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
                        if (!(this.currentGame.phase === GamePhase_1.GamePhase.DAY && !this.currentGame.roleInLine && !this.currentGame.playerInLine)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.dayPhase()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!(this.currentGame.phase === GamePhase_1.GamePhase.DISCUSSION && !this.currentGame.roleInLine && !this.currentGame.playerInLine)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.discussionPhase()];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        if (!(this.currentGame.phase === GamePhase_1.GamePhase.VOTING && !this.currentGame.roleInLine && !this.currentGame.playerInLine)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.votingPhase()];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    GameCore.prototype.startNewRound = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _a, _b, _i, roles_1, role, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (!!this.currentGame.round) return [3 /*break*/, 8];
                        _a = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, "Hello everyone, the game has started and you will be assigned the appropriate role", 2000)];
                    case 1:
                        _a.currentGame = _g.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubMessage(this.currentGame, this.pubsub)];
                    case 2:
                        _g.sent();
                        _b = this;
                        return [4 /*yield*/, dbController_1.DBController.setRoles(this.currentGame, GameAlgorithms_1.GameAlgorithms.distributeRoles(this.currentGame.players))];
                    case 3:
                        _b.currentGame = _g.sent();
                        _i = 0, roles_1 = variables_1.roles;
                        _g.label = 4;
                    case 4:
                        if (!(_i < roles_1.length)) return [3 /*break*/, 8];
                        role = roles_1[_i];
                        _c = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, role, "You are " + role, 2000)];
                    case 5:
                        _c.currentGame = _g.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubMessage(this.currentGame, this.pubsub)];
                    case 6:
                        _g.sent();
                        _g.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 4];
                    case 8:
                        _d = this;
                        return [4 /*yield*/, dbController_1.DBController.newRound(this.currentGame)];
                    case 9:
                        _d.currentGame = _g.sent();
                        _e = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, "Round " + this.currentGame.round)];
                    case 10:
                        _e.currentGame = _g.sent();
                        _f = this;
                        return [4 /*yield*/, dbController_1.DBController.setPhase(this.currentGame, GamePhase_1.GamePhase.NIGHT)];
                    case 11:
                        _f.currentGame = _g.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubMessage(this.currentGame, this.pubsub)];
                    case 12:
                        _g.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GameCore.prototype.nightPhase = function () {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, Promise, function () {
            var _e, lastRoleInLine, nextRoleInLine, _f, _g, _h, _j, nextPlayerInLine, _k, _l, _m, mafia, winner, _o, _p, _q, _r, _s;
            return __generator(this, function (_t) {
                switch (_t.label) {
                    case 0:
                        if (!(this.currentGame.roleInLine === Roles_1.Roles.NOBODY &&
                            this.currentGame.playerInLine === null)) return [3 /*break*/, 3];
                        _e = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, "The city is falling asleep")];
                    case 1:
                        _e.currentGame = _t.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubMessage(this.currentGame, this.pubsub)];
                    case 2:
                        _t.sent();
                        _t.label = 3;
                    case 3:
                        lastRoleInLine = this.currentGame.roleInLine;
                        nextRoleInLine = GameAlgorithms_1.GameAlgorithms.nextRoleInLine(this.currentGame);
                        _f = this;
                        return [4 /*yield*/, dbController_1.DBController.setRoleInLine(this.currentGame, nextRoleInLine)];
                    case 4:
                        _f.currentGame = _t.sent();
                        if (!(lastRoleInLine !== this.currentGame.roleInLine)) return [3 /*break*/, 7];
                        _g = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, "The " + this.currentGame.roleInLine + " is waking up")];
                    case 5:
                        _g.currentGame = _t.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubMessage(this.currentGame, this.pubsub)];
                    case 6:
                        _t.sent();
                        _t.label = 7;
                    case 7:
                        if (!!this.currentGame.roleInLine) return [3 /*break*/, 10];
                        _h = this;
                        return [4 /*yield*/, dbController_1.DBController.setPhase(this.currentGame, GamePhase_1.GamePhase.DAY)];
                    case 8:
                        _h.currentGame = _t.sent();
                        _j = this;
                        return [4 /*yield*/, dbController_1.DBController.cleanVoting(this.currentGame)];
                    case 9:
                        _j.currentGame = _t.sent();
                        return [3 /*break*/, 15];
                    case 10:
                        nextPlayerInLine = GameAlgorithms_1.GameAlgorithms.nextPlayerInLine(this.currentGame);
                        _k = this;
                        return [4 /*yield*/, dbController_1.DBController.setPlayerInLine(this.currentGame, nextPlayerInLine)];
                    case 11:
                        _k.currentGame = _t.sent();
                        if (!(this.currentGame.playerInLine && ((_b = dbController_1.DBController.getPlayerRoleById(this.currentGame, (_a = this.currentGame.playerInLine) === null || _a === void 0 ? void 0 : _a.playerId)) === null || _b === void 0 ? void 0 : _b.alibi) === this.currentGame.round)) return [3 /*break*/, 13];
                        _l = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, this.currentGame.roleInLine, "You are blocked, your lover chose you")];
                    case 12:
                        _l.currentGame = _t.sent();
                        this.nightPhase();
                        return [3 /*break*/, 15];
                    case 13:
                        _m = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, this.currentGame.roleInLine, "This is " + ((_c = this.currentGame.playerInLine) === null || _c === void 0 ? void 0 : _c.nickname) + " speaking")];
                    case 14:
                        _m.currentGame = _t.sent();
                        _t.label = 15;
                    case 15:
                        if (!(this.currentGame.roleInLine === Roles_1.Roles.MAFIA)) return [3 /*break*/, 22];
                        mafia = this.currentGame.roles.filter(function (role) { return role.name === Roles_1.Roles.MAFIA || role.name === Roles_1.Roles.DON; });
                        if (!(this.currentGame.voting.length == mafia.length)) return [3 /*break*/, 22];
                        winner = GameAlgorithms_1.GameAlgorithms.voting(this.currentGame.voting);
                        if (!winner) return [3 /*break*/, 18];
                        _o = this;
                        return [4 /*yield*/, dbController_1.DBController.setKill(this.currentGame, winner.playerId)];
                    case 16:
                        _o.currentGame = _t.sent();
                        _p = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, this.currentGame.roleInLine, ((_d = this.currentGame.playerInLine) === null || _d === void 0 ? void 0 : _d.nickname) + " won the vote")];
                    case 17:
                        _p.currentGame = _t.sent();
                        return [3 /*break*/, 22];
                    case 18:
                        _q = this;
                        return [4 /*yield*/, dbController_1.DBController.cleanVoting(this.currentGame)];
                    case 19:
                        _q.currentGame = _t.sent();
                        _r = this;
                        return [4 /*yield*/, dbController_1.DBController.setPlayerInLine(this.currentGame, null)];
                    case 20:
                        _r.currentGame = _t.sent();
                        _s = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, this.currentGame.roleInLine, "There is no winner of the poll, please vote again")];
                    case 21:
                        _s.currentGame = _t.sent();
                        _t.label = 22;
                    case 22: return [2 /*return*/];
                }
            });
        });
    };
    GameCore.prototype.dayPhase = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _a, killed, _b, _c, _i, killed_1, role, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, "Everyone wakes up")];
                    case 1:
                        _a.currentGame = _g.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubMessage(this.currentGame, this.pubsub)];
                    case 2:
                        _g.sent();
                        killed = GameAlgorithms_1.GameAlgorithms.determinateKilled(this.currentGame);
                        if (!killed.length) return [3 /*break*/, 4];
                        _b = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, "That night, " + killed.map(function (role) { return role.player.nickname; }).join(', ') + " were killed")];
                    case 3:
                        _b.currentGame = _g.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        _c = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, "No one was killed that night")];
                    case 5:
                        _c.currentGame = _g.sent();
                        _g.label = 6;
                    case 6:
                        _i = 0, killed_1 = killed;
                        _g.label = 7;
                    case 7:
                        if (!(_i < killed_1.length)) return [3 /*break*/, 11];
                        role = killed_1[_i];
                        _d = this;
                        return [4 /*yield*/, dbController_1.DBController.deletePlayer(this.currentGame, role.player.playerId)];
                    case 8:
                        _d.currentGame = _g.sent();
                        _e = this;
                        return [4 /*yield*/, dbController_1.DBController.addPlayerToObservers(this.currentGame, role.player)];
                    case 9:
                        _e.currentGame = _g.sent();
                        _g.label = 10;
                    case 10:
                        _i++;
                        return [3 /*break*/, 7];
                    case 11: return [4 /*yield*/, this.endingGame()];
                    case 12:
                        _g.sent();
                        _f = this;
                        return [4 /*yield*/, dbController_1.DBController.setPhase(this.currentGame, GamePhase_1.GamePhase.VOTING)];
                    case 13:
                        _f.currentGame = _g.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GameCore.prototype.discussionPhase = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _a, nextPlayerInLine, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!(this.currentGame.roleInLine === Roles_1.Roles.NOBODY &&
                            this.currentGame.playerInLine === null)) return [3 /*break*/, 3];
                        _a = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, "The day's discussion begins")];
                    case 1:
                        _a.currentGame = _e.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubMessage(this.currentGame, this.pubsub)];
                    case 2:
                        _e.sent();
                        _e.label = 3;
                    case 3:
                        nextPlayerInLine = GameAlgorithms_1.GameAlgorithms.nextPlayer(this.currentGame);
                        _b = this;
                        return [4 /*yield*/, dbController_1.DBController.setPlayerInLine(this.currentGame, nextPlayerInLine)];
                    case 4:
                        _b.currentGame = _e.sent();
                        if (!(nextPlayerInLine === null)) return [3 /*break*/, 7];
                        _c = this;
                        return [4 /*yield*/, dbController_1.DBController.setPhase(this.currentGame, GamePhase_1.GamePhase.VOTING)];
                    case 5:
                        _c.currentGame = _e.sent();
                        return [4 /*yield*/, this.startNewRound()];
                    case 6:
                        _e.sent();
                        return [3 /*break*/, 9];
                    case 7:
                        _d = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, nextPlayerInLine + "'s speaking")];
                    case 8:
                        _d.currentGame = _e.sent();
                        _e.label = 9;
                    case 9: return [4 /*yield*/, PubController_1.PubController.pubMessage(this.currentGame, this.pubsub)];
                    case 10:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GameCore.prototype.votingPhase = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _a, nextPlayerInLine, _b, _c, winner, winnerRole, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        if (!(this.currentGame.roleInLine === Roles_1.Roles.NOBODY &&
                            this.currentGame.playerInLine === null)) return [3 /*break*/, 3];
                        _a = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, "Voting begins")];
                    case 1:
                        _a.currentGame = _k.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubMessage(this.currentGame, this.pubsub)];
                    case 2:
                        _k.sent();
                        _k.label = 3;
                    case 3:
                        nextPlayerInLine = GameAlgorithms_1.GameAlgorithms.nextPlayer(this.currentGame);
                        _b = this;
                        return [4 /*yield*/, dbController_1.DBController.setPlayerInLine(this.currentGame, nextPlayerInLine)];
                    case 4:
                        _b.currentGame = _k.sent();
                        if (!(nextPlayerInLine === null)) return [3 /*break*/, 20];
                        _c = this;
                        return [4 /*yield*/, dbController_1.DBController.setPhase(this.currentGame, GamePhase_1.GamePhase.NIGHT)];
                    case 5:
                        _c.currentGame = _k.sent();
                        winner = GameAlgorithms_1.GameAlgorithms.voting(this.currentGame.voting);
                        if (!winner) return [3 /*break*/, 16];
                        winnerRole = dbController_1.DBController.getPlayerRoleById(this.currentGame, winner.playerId);
                        if (!!(winnerRole === null || winnerRole === void 0 ? void 0 : winnerRole.alibi)) return [3 /*break*/, 12];
                        _d = this;
                        return [4 /*yield*/, dbController_1.DBController.deletePlayer(this.currentGame, winner.playerId)];
                    case 6:
                        _d.currentGame = _k.sent();
                        _e = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, winner.nickname + " won the vote. He is leaving the game")];
                    case 7:
                        _e.currentGame = _k.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubMessage(this.currentGame, this.pubsub)];
                    case 8:
                        _k.sent();
                        _f = this;
                        return [4 /*yield*/, dbController_1.DBController.addPlayerToObservers(this.currentGame, winner)];
                    case 9:
                        _f.currentGame = _k.sent();
                        return [4 /*yield*/, this.endingGame()];
                    case 10:
                        _k.sent();
                        return [4 /*yield*/, this.startNewRound()];
                    case 11:
                        _k.sent();
                        return [3 /*break*/, 15];
                    case 12:
                        _g = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, "Today mistress visited him " + winner.nickname + ". He continues the game")];
                    case 13:
                        _g.currentGame = _k.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubMessage(this.currentGame, this.pubsub)];
                    case 14:
                        _k.sent();
                        _k.label = 15;
                    case 15: return [3 /*break*/, 19];
                    case 16:
                        _h = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, "There is no winner of the poll, please vote again")];
                    case 17:
                        _h.currentGame = _k.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubMessage(this.currentGame, this.pubsub)];
                    case 18:
                        _k.sent();
                        _k.label = 19;
                    case 19: return [3 /*break*/, 23];
                    case 20:
                        _j = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, nextPlayerInLine + " votes")];
                    case 21:
                        _j.currentGame = _k.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubMessage(this.currentGame, this.pubsub)];
                    case 22:
                        _k.sent();
                        _k.label = 23;
                    case 23: return [2 /*return*/];
                }
            });
        });
    };
    GameCore.prototype.endingGame = function () {
        return __awaiter(this, void 0, Promise, function () {
            var mafia, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        mafia = this.currentGame.roles.filter(function (role) { return role.name === Roles_1.Roles.MAFIA || role.name === Roles_1.Roles.DON; });
                        if (!(mafia.length >= this.currentGame.roles.length - mafia.length)) return [3 /*break*/, 4];
                        _a = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, "The mafia won")];
                    case 1:
                        _a.currentGame = _c.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubMessage(this.currentGame, this.pubsub)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, dbController_1.DBController.deleteGame(this.currentGame, 60000)];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        if (!(mafia.length === 0)) return [3 /*break*/, 8];
                        _b = this;
                        return [4 /*yield*/, dbController_1.DBController.addMessage(this.currentGame, { nickname: Roles_1.Roles.ADMIN, playerId: Roles_1.Roles.ADMIN }, Roles_1.Roles.ALL, "Citizens won")];
                    case 5:
                        _b.currentGame = _c.sent();
                        return [4 /*yield*/, PubController_1.PubController.pubMessage(this.currentGame, this.pubsub)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, dbController_1.DBController.deleteGame(this.currentGame, 10000)];
                    case 7:
                        _c.sent();
                        _c.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return GameCore;
}());
exports.GameCore = GameCore;
