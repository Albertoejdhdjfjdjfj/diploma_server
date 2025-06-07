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
exports.GameAlgorithms = void 0;
var GamePhase_1 = require("../enums/GamePhase");
var variables_1 = require("../variables/variables");
var Roles_1 = require("../enums/Roles");
var SelectionController_1 = require("./SelectionController");
var dbController_1 = require("./dbController");
var GameValidator_1 = require("./GameValidator");
var variables_2 = require("../variables/variables");
var GameAlgorithms = /** @class */ (function () {
    function GameAlgorithms() {
    }
    GameAlgorithms.determineReceiverRole = function (senderRole, phase, playerRoleName) {
        switch (senderRole) {
            case Roles_1.Roles.LOVER: return phase === GamePhase_1.GamePhase.NIGHT ? Roles_1.Roles.LOVER : Roles_1.Roles.ALL;
            case Roles_1.Roles.MAFIA: return phase === GamePhase_1.GamePhase.NIGHT ? Roles_1.Roles.MAFIA : Roles_1.Roles.ALL;
            case Roles_1.Roles.DON: return (phase === GamePhase_1.GamePhase.VOTING || phase === GamePhase_1.GamePhase.DISCUSSION) ? Roles_1.Roles.ALL : playerRoleName === Roles_1.Roles.MAFIA ? Roles_1.Roles.MAFIA : Roles_1.Roles.DON;
            case Roles_1.Roles.SHERIFF: return phase === GamePhase_1.GamePhase.NIGHT ? Roles_1.Roles.SHERIFF : Roles_1.Roles.ALL;
            case Roles_1.Roles.DOCTOR: phase === GamePhase_1.GamePhase.NIGHT ? Roles_1.Roles.DOCTOR : Roles_1.Roles.ALL;
            case Roles_1.Roles.MANIAC: phase === GamePhase_1.GamePhase.NIGHT ? Roles_1.Roles.MANIAC : Roles_1.Roles.ALL;
        }
        return Roles_1.Roles.NOBODY;
    };
    GameAlgorithms.getWordStartingWithAt = function (text) {
        var regex = /@(\w+)/g;
        var matches = regex.exec(text);
        return matches ? matches[1] : null;
    };
    GameAlgorithms.selectionProcess = function (currentGame, playerId, targetId, pubsub) {
        var _a, _b;
        return __awaiter(this, void 0, Promise, function () {
            var playerRole, targetRole, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        playerRole = dbController_1.DBController.getPlayerRoleById(currentGame, playerId);
                        if (!playerRole) {
                            throw new Error("You are not a player in this game");
                        }
                        targetRole = dbController_1.DBController.getPlayerRoleById(currentGame, targetId);
                        if ((playerRole.name !== currentGame.roleInLine && playerRole.player.nickname !== ((_a = currentGame.playerInLine) === null || _a === void 0 ? void 0 : _a.nickname)) || playerRole.player.nickname !== ((_b = currentGame.playerInLine) === null || _b === void 0 ? void 0 : _b.nickname)) {
                            throw new Error("You can not select now");
                        }
                        if (targetRole && !GameValidator_1.GameValidator.validTarget(playerRole.name, targetRole.name, currentGame.phase)) {
                            throw new Error("You can not select this target");
                        }
                        _c = playerRole.name;
                        switch (_c) {
                            case Roles_1.Roles.LOVER: return [3 /*break*/, 1];
                            case Roles_1.Roles.MAFIA: return [3 /*break*/, 3];
                            case Roles_1.Roles.DON: return [3 /*break*/, 5];
                            case Roles_1.Roles.SHERIFF: return [3 /*break*/, 7];
                            case Roles_1.Roles.DOCTOR: return [3 /*break*/, 9];
                            case Roles_1.Roles.MANIAC: return [3 /*break*/, 11];
                        }
                        return [3 /*break*/, 13];
                    case 1: return [4 /*yield*/, SelectionController_1.SelectionController.loverSelection(currentGame, playerRole, targetRole, pubsub)];
                    case 2:
                        currentGame = _d.sent();
                        return [3 /*break*/, 13];
                    case 3: return [4 /*yield*/, SelectionController_1.SelectionController.mafiaSelection(currentGame, playerRole, targetRole, pubsub)];
                    case 4:
                        currentGame = _d.sent();
                        return [3 /*break*/, 13];
                    case 5: return [4 /*yield*/, SelectionController_1.SelectionController.donSelection(currentGame, playerRole, targetRole, pubsub)];
                    case 6:
                        currentGame = _d.sent();
                        return [3 /*break*/, 13];
                    case 7: return [4 /*yield*/, SelectionController_1.SelectionController.sheriffSelection(currentGame, playerRole, targetRole, pubsub)];
                    case 8:
                        currentGame = _d.sent();
                        return [3 /*break*/, 13];
                    case 9: return [4 /*yield*/, SelectionController_1.SelectionController.doctorSelection(currentGame, playerRole, targetRole, pubsub)];
                    case 10:
                        currentGame = _d.sent();
                        return [3 /*break*/, 13];
                    case 11: return [4 /*yield*/, SelectionController_1.SelectionController.maniakSelection(currentGame, playerRole, targetRole, pubsub)];
                    case 12:
                        currentGame = _d.sent();
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/, currentGame];
                }
            });
        });
    };
    GameAlgorithms.nextRoleInLine = function (currentGame) {
        var currentRole = currentGame.roleInLine;
        var currentRoleIndex = variables_2.rolesLine.indexOf(currentRole);
        var nextRoleIndex = currentRoleIndex + 1;
        console.log(nextRoleIndex, currentGame.roles.length, nextRoleIndex === currentGame.roles.length);
        if (nextRoleIndex === currentGame.roles.length) {
            return Roles_1.Roles.NOBODY;
        }
        var _loop_1 = function (i) {
            var nextRole = variables_2.rolesLine[i];
            if (currentGame.roles.some(function (role) { return role.name === nextRole; })) {
                currentRole = nextRole;
                return "break";
            }
        };
        for (var i = nextRoleIndex; i < variables_2.rolesLine.length; i++) {
            var state_1 = _loop_1(i);
            if (state_1 === "break")
                break;
        }
        return currentRole;
    };
    GameAlgorithms.nextPlayer = function (currentGame) {
        var playerIndex = currentGame.players.findIndex(function (player) { var _a; return player.nickname === ((_a = currentGame.playerInLine) === null || _a === void 0 ? void 0 : _a.nickname); });
        if (playerIndex + 1 >= currentGame.players.length) {
            return null;
        }
        console.log(currentGame.players);
        console.log(currentGame.players[playerIndex]);
        return currentGame.players[playerIndex + 1];
    };
    GameAlgorithms.nextPlayerInLine = function (currentGame) {
        var players;
        if (currentGame.roleInLine === Roles_1.Roles.MAFIA) {
            players = currentGame.roles.filter(function (role) { return role.name === Roles_1.Roles.MAFIA || role.name === Roles_1.Roles.DON; });
        }
        else {
            players = currentGame.roles.filter(function (role) { return role.name === currentGame.roleInLine; });
        }
        var currentPlayerIndex = players.findIndex(function (role) { var _a; return role.player.nickname === ((_a = currentGame.playerInLine) === null || _a === void 0 ? void 0 : _a.nickname); });
        if (currentPlayerIndex + 1 <= players.length) {
            return players[currentPlayerIndex + 1].player;
        }
        return null;
    };
    GameAlgorithms.determinateKilled = function (currentGame) {
        var roles = currentGame.roles.filter(function (role) { return role.alive === false; });
        return roles;
    };
    GameAlgorithms.voting = function (players) {
        var voteCount = {};
        players.forEach(function (player) {
            if (player.nickname in voteCount) {
                voteCount[player.nickname]++;
            }
            else {
                voteCount[player.nickname] = 1;
            }
        });
        var winner = null;
        var maxVotes = 0;
        var _loop_2 = function (nickname, votes) {
            if (votes > maxVotes) {
                maxVotes = votes;
                winner = players.find(function (player) { return player.nickname === nickname; }) || null;
            }
        };
        for (var _i = 0, _a = Object.entries(voteCount); _i < _a.length; _i++) {
            var _b = _a[_i], nickname = _b[0], votes = _b[1];
            _loop_2(nickname, votes);
        }
        return winner;
    };
    GameAlgorithms.distributeRoles = function (players) {
        var playersWithRoles = [];
        var availablePlayers = __spreadArrays(players);
        for (var _i = 0, _a = variables_1.rolesDistribution[availablePlayers.length - variables_1.playersMin]; _i < _a.length; _i++) {
            var role = _a[_i];
            for (var i = 0; i < role.num; i++) {
                var index = Math.floor(Math.random() * availablePlayers.length);
                var player = availablePlayers[index];
                playersWithRoles.push({
                    player: player,
                    name: role.name,
                    alive: true,
                    alibi: 0,
                    active: true,
                    treated: 0
                });
                availablePlayers.splice(index, 1);
            }
        }
        return playersWithRoles;
    };
    return GameAlgorithms;
}());
exports.GameAlgorithms = GameAlgorithms;
