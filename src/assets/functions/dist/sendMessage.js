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
exports.sendMessage = void 0;
var dbController_1 = require("../classes/dbController");
var GameAlgorithms_1 = require("../classes/GameAlgorithms");
var PubController_1 = require("../classes/PubController");
function sendMessage(currentGame, content, player, pubsub) {
    var _a, _b, _c;
    return __awaiter(this, void 0, Promise, function () {
        var playerRole, receiver, target, targetId, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 6, , 7]);
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
                    if (!target) return [3 /*break*/, 3];
                    targetId = (_c = dbController_1.DBController.getPlayerByName(currentGame, target)) === null || _c === void 0 ? void 0 : _c.playerId;
                    if (!targetId) {
                        throw new Error("Target is not player in this game");
                    }
                    return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, player, receiver, content)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, PubController_1.PubController.pubMessage(currentGame, pubsub)];
                case 2:
                    _d.sent();
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, dbController_1.DBController.addMessage(currentGame, player, receiver, content)];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, PubController_1.PubController.pubMessage(currentGame, pubsub)];
                case 5:
                    _d.sent();
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _d.sent();
                    throw new Error(error_1.message);
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.sendMessage = sendMessage;
