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
exports.sendAITimeoutMessage = void 0;
var dbController_1 = require("../classes/dbController");
var GameAlgorithms_1 = require("../classes/GameAlgorithms");
var Game_1 = require("../models/Game");
var PubController_1 = require("../classes/PubController");
var GameCore_1 = require("../../core/GameCore");
var AIMessage_1 = require("./AIMessage");
function sendAITimeoutMessage(currentGame, pubsub, duration) {
    if (duration === void 0) { duration = 120000; }
    return __awaiter(this, void 0, Promise, function () {
        var gameId, lastPlayer;
        var _this = this;
        return __generator(this, function (_a) {
            gameId = currentGame.id;
            lastPlayer = currentGame.playerInLine;
            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                var currentGame_1, receiver, content, target, targetId, _a;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 9, , 10]);
                            return [4 /*yield*/, Game_1.GameModel.findById(gameId)];
                        case 1:
                            currentGame_1 = _d.sent();
                            if (!currentGame_1) {
                                throw new Error("Игра не существует");
                            }
                            if (!(currentGame_1.playerInLine && ((lastPlayer === null || lastPlayer === void 0 ? void 0 : lastPlayer.playerId) === ((_b = currentGame_1.playerInLine) === null || _b === void 0 ? void 0 : _b.playerId)))) return [3 /*break*/, 8];
                            receiver = GameAlgorithms_1.GameAlgorithms.determineReceiverRole(currentGame_1.roleInLine, currentGame_1.phase, currentGame_1.roleInLine);
                            return [4 /*yield*/, AIMessage_1.AIMessage(currentGame_1.roleInLine, currentGame_1.playerInLine, currentGame_1)];
                        case 2:
                            content = _d.sent();
                            console.log(content);
                            target = GameAlgorithms_1.GameAlgorithms.getWordStartingWithAt(content);
                            if (!target) return [3 /*break*/, 5];
                            targetId = (_c = dbController_1.DBController.getPlayerByName(currentGame_1, target)) === null || _c === void 0 ? void 0 : _c.playerId;
                            if (!targetId) {
                                throw new Error("Цель не является игроком в этой игре");
                            }
                            return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame_1, currentGame_1.playerInLine, receiver, content)];
                        case 3:
                            _d.sent();
                            return [4 /*yield*/, PubController_1.PubController.pubMessage(currentGame_1, pubsub)];
                        case 4:
                            _d.sent();
                            new GameCore_1.GameCore(currentGame_1, pubsub).game();
                            return [2 /*return*/];
                        case 5: return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame_1, currentGame_1.playerInLine, receiver, content)];
                        case 6:
                            _d.sent();
                            return [4 /*yield*/, PubController_1.PubController.pubMessage(currentGame_1, pubsub)];
                        case 7:
                            _d.sent();
                            _d.label = 8;
                        case 8: return [3 /*break*/, 10];
                        case 9:
                            _a = _d.sent();
                            return [3 /*break*/, 10];
                        case 10: return [2 /*return*/];
                    }
                });
            }); }, duration);
            return [2 /*return*/];
        });
    });
}
exports.sendAITimeoutMessage = sendAITimeoutMessage;
