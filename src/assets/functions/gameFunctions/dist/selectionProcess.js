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
exports.selectionProcess = void 0;
var Roles_1 = require("../../enums/Roles");
var GamePhase_1 = require("../../enums/GamePhase");
var targetValidator_1 = require("../validators/targetValidator");
var dbController_1 = require("../../classes/dbController");
var selectionController_1 = require("../../classes/selectionController");
function selectionProcess(currentGame, playerId, targetId, pubsub) {
    return __awaiter(this, void 0, Promise, function () {
        var playerRole, targetRole, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    playerRole = dbController_1.DBController.getPlayerRole(currentGame, playerId, "You are not a player in this game");
                    targetRole = currentGame.roles.find(function (role) { return role.user.playerId === targetId; });
                    if (!(playerRole.user.nickname !== currentGame.player ||
                        playerRole.name !== currentGame.role ||
                        currentGame.phase == GamePhase_1.GamePhase.DAY)) {
                        throw new Error("You can not select now");
                    }
                    if (targetRole && !targetValidator_1.targetValidator(playerRole.name, targetRole.name, currentGame.phase)) {
                        throw new Error("You can not select this target");
                    }
                    _a = playerRole.name;
                    switch (_a) {
                        case Roles_1.Roles.LOVER: return [3 /*break*/, 1];
                        case Roles_1.Roles.MAFIA: return [3 /*break*/, 3];
                        case Roles_1.Roles.DON: return [3 /*break*/, 5];
                        case Roles_1.Roles.SHERIFF: return [3 /*break*/, 7];
                        case Roles_1.Roles.DOCTOR: return [3 /*break*/, 9];
                        case Roles_1.Roles.MANIAC: return [3 /*break*/, 11];
                    }
                    return [3 /*break*/, 13];
                case 1: return [4 /*yield*/, selectionController_1.SelectionController.loverSelection(currentGame, playerRole, targetRole, pubsub)];
                case 2:
                    currentGame = _b.sent();
                    return [3 /*break*/, 13];
                case 3: return [4 /*yield*/, selectionController_1.SelectionController.mafiaSelection(currentGame, playerRole, targetRole, pubsub)];
                case 4:
                    currentGame = _b.sent();
                    return [3 /*break*/, 13];
                case 5: return [4 /*yield*/, selectionController_1.SelectionController.donSelection(currentGame, playerRole, targetRole, pubsub)];
                case 6:
                    currentGame = _b.sent();
                    return [3 /*break*/, 13];
                case 7: return [4 /*yield*/, selectionController_1.SelectionController.sheriffSelection(currentGame, playerRole, targetRole, pubsub)];
                case 8:
                    currentGame = _b.sent();
                    return [3 /*break*/, 13];
                case 9: return [4 /*yield*/, selectionController_1.SelectionController.doctorSelection(currentGame, playerRole, targetRole, pubsub)];
                case 10:
                    currentGame = _b.sent();
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, selectionController_1.SelectionController.maniakSelection(currentGame, playerRole, targetRole, pubsub)];
                case 12:
                    currentGame = _b.sent();
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/, currentGame];
            }
        });
    });
}
exports.selectionProcess = selectionProcess;
