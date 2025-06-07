"use strict";
exports.__esModule = true;
exports.filterMessage = void 0;
var GamePhase_1 = require("../enums/GamePhase");
var Roles_1 = require("../enums/Roles");
function filterMessage(message, receiverRole) {
    switch (receiverRole) {
        case Roles_1.Roles.LOVER: {
            if (message.receiverRole === Roles_1.Roles.LOVER) {
                return message;
            }
            if (message.receiverRole === Roles_1.Roles.ALL) {
                return message;
            }
            return null;
        }
        case Roles_1.Roles.MAFIA: {
            if (message.receiverRole === Roles_1.Roles.MAFIA) {
                return message;
            }
            if (message.receiverRole === Roles_1.Roles.ALL) {
                return message;
            }
            return null;
        }
        case Roles_1.Roles.DON: {
            if (message.phase === GamePhase_1.GamePhase.NIGHT) {
                if (message.receiverRole === Roles_1.Roles.MAFIA) {
                    return message;
                }
                if (message.receiverRole === Roles_1.Roles.DON) {
                    return message;
                }
            }
            if (message.receiverRole === Roles_1.Roles.DON) {
                return message;
            }
            if (message.receiverRole === Roles_1.Roles.ALL) {
                return message;
            }
            return null;
        }
        case Roles_1.Roles.SHERIFF: {
            if (message.receiverRole === Roles_1.Roles.SHERIFF) {
                return message;
            }
            if (message.receiverRole === Roles_1.Roles.ALL) {
                return message;
            }
            return null;
        }
        case Roles_1.Roles.DOCTOR: {
            if (message.receiverRole === Roles_1.Roles.DOCTOR) {
                return message;
            }
            if (message.receiverRole === Roles_1.Roles.ALL) {
                return message;
            }
            return null;
        }
        case Roles_1.Roles.MANIAC: {
            if (message.receiverRole === Roles_1.Roles.MANIAC) {
                return message;
            }
            if (message.receiverRole === Roles_1.Roles.ALL) {
                return message;
            }
            return null;
        }
        case Roles_1.Roles.CIVILIAN: {
            if (message.receiverRole === Roles_1.Roles.CIVILIAN) {
                return message;
            }
            if (message.receiverRole === Roles_1.Roles.ALL) {
                return message;
            }
            return null;
        }
    }
    return message;
}
exports.filterMessage = filterMessage;
