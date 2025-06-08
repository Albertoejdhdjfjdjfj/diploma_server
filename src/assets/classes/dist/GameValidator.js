"use strict";
exports.__esModule = true;
exports.GameValidator = void 0;
var GamePhase_1 = require("../enums/GamePhase");
var Roles_1 = require("../enums/Roles");
var GameValidator = /** @class */ (function () {
    function GameValidator() {
    }
    GameValidator.validTarget = function (playerRole, targetRole, phase) {
        switch (playerRole) {
            case Roles_1.Roles.LOVER: return (targetRole !== Roles_1.Roles.LOVER) ? true : false;
            case Roles_1.Roles.MAFIA: return (targetRole !== Roles_1.Roles.MAFIA && targetRole !== Roles_1.Roles.DON) ? true : (phase == GamePhase_1.GamePhase.VOTING) ? true : false;
            case Roles_1.Roles.DON: return (targetRole !== Roles_1.Roles.MAFIA && targetRole !== Roles_1.Roles.DON) ? true : (phase == GamePhase_1.GamePhase.VOTING) ? true : false;
            case Roles_1.Roles.SHERIFF: return (targetRole !== Roles_1.Roles.SHERIFF) ? true : false;
            case Roles_1.Roles.DOCTOR: return true;
            case Roles_1.Roles.MANIAC: return (targetRole !== Roles_1.Roles.MANIAC) ? true : false;
        }
        return false;
    };
    return GameValidator;
}());
exports.GameValidator = GameValidator;
