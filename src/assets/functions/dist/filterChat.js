"use strict";
exports.__esModule = true;
exports.filterChat = void 0;
var GamePhase_1 = require("../enums/GamePhase");
var Roles_1 = require("../enums/Roles");
function filterChat(chat, receiverRole) {
    switch (receiverRole) {
        case Roles_1.Roles.LOVER: return chat.filter(function (message) { return (message.receiverRole === Roles_1.Roles.ALL) || (message.receiverRole === Roles_1.Roles.LOVER); });
        case Roles_1.Roles.MAFIA: return chat.filter(function (message) { return (message.receiverRole === Roles_1.Roles.ALL) || (message.receiverRole === Roles_1.Roles.MAFIA); });
        case Roles_1.Roles.DON: return chat.filter(function (message) { return ((message.phase === GamePhase_1.GamePhase.VOTING) && (message.receiverRole === Roles_1.Roles.DON)) || (message.receiverRole === Roles_1.Roles.ALL) || (message.receiverRole === Roles_1.Roles.MAFIA) || (message.receiverRole === Roles_1.Roles.DON); });
        case Roles_1.Roles.SHERIFF: return chat.filter(function (message) { return (message.receiverRole === Roles_1.Roles.ALL) || (message.receiverRole === Roles_1.Roles.SHERIFF); });
        case Roles_1.Roles.DOCTOR: return chat.filter(function (message) { return (message.receiverRole === Roles_1.Roles.ALL) || (message.receiverRole === Roles_1.Roles.DOCTOR); });
        case Roles_1.Roles.MANIAC: return chat.filter(function (message) { return (message.receiverRole === Roles_1.Roles.ALL) || (message.receiverRole === Roles_1.Roles.MANIAC); });
        case Roles_1.Roles.CIVILIAN: return chat.filter(function (message) { return (message.receiverRole === Roles_1.Roles.ALL) || (message.receiverRole === Roles_1.Roles.CIVILIAN); });
    }
    return chat;
}
exports.filterChat = filterChat;
