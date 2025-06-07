"use strict";
exports.__esModule = true;
exports.filterChat = void 0;
var GamePhase_1 = require("../enums/GamePhase");
var Roles_1 = require("../enums/Roles");
function filterChat(chat, receiverRole) {
    switch (receiverRole) {
        case Roles_1.Roles.LOVER: return chat.filter(function (message) {
            if (message.receiverRole === Roles_1.Roles.LOVER) {
                return true;
            }
            if (message.receiverRole === Roles_1.Roles.ALL) {
                return true;
            }
            return false;
        });
        case Roles_1.Roles.MAFIA: return chat.filter(function (message) {
            if (message.receiverRole === Roles_1.Roles.MAFIA) {
                return true;
            }
            if (message.receiverRole === Roles_1.Roles.ALL) {
                return true;
            }
            return false;
        });
        case Roles_1.Roles.DON: return chat.filter(function (message) {
            if (message.phase === GamePhase_1.GamePhase.NIGHT) {
                if (message.receiverRole === Roles_1.Roles.MAFIA) {
                    return true;
                }
                if (message.receiverRole === Roles_1.Roles.DON) {
                    return true;
                }
            }
            if (message.receiverRole === Roles_1.Roles.DON) {
                return true;
            }
            if (message.receiverRole === Roles_1.Roles.ALL) {
                return true;
            }
            return false;
        });
        case Roles_1.Roles.SHERIFF: return chat.filter(function (message) {
            if (message.receiverRole === Roles_1.Roles.SHERIFF) {
                return true;
            }
            if (message.receiverRole === Roles_1.Roles.ALL) {
                return true;
            }
            return false;
        });
        case Roles_1.Roles.DOCTOR: return chat.filter(function (message) {
            if (message.receiverRole === Roles_1.Roles.DOCTOR) {
                return true;
            }
            if (message.receiverRole === Roles_1.Roles.ALL) {
                return true;
            }
            return false;
        });
        case Roles_1.Roles.MANIAC: return chat.filter(function (message) {
            if (message.receiverRole === Roles_1.Roles.MANIAC) {
                return true;
            }
            if (message.receiverRole === Roles_1.Roles.ALL) {
                return true;
            }
            return false;
        });
        case Roles_1.Roles.CIVILIAN: return chat.filter(function (message) {
            if (message.receiverRole === Roles_1.Roles.CIVILIAN) {
                return true;
            }
            if (message.receiverRole === Roles_1.Roles.ALL) {
                return true;
            }
            return false;
        });
    }
    return chat;
}
exports.filterChat = filterChat;
