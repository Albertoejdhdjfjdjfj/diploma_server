"use strict";
exports.__esModule = true;
exports.nextPlayer = void 0;
var Roles_1 = require("../../enums/Roles");
var GamePhase_1 = require("../../enums/GamePhase");
function nextPlayer(currentGame) {
    if (currentGame.role === Roles_1.Roles.MAFIA) {
        var mafia = currentGame.roles.filter(function (role) { return role.name === Roles_1.Roles.MAFIA || role.name === Roles_1.Roles.DON; });
        if (mafia.length !== currentGame.voting.length) {
            var playerIndex = mafia.findIndex(function (role) { return role.user.nickname === currentGame.player; });
            return mafia[playerIndex].user.nickname;
        }
        return Roles_1.Roles.NOBODY;
    }
    if (currentGame.phase === GamePhase_1.GamePhase.VOTING) {
        var playerIndex = currentGame.players.findIndex(function (player) { return player.nickname === currentGame.role; });
        if (playerIndex >= currentGame.players.length - 1) {
            return Roles_1.Roles.NOBODY;
        }
        return currentGame.players[playerIndex + 1].nickname;
    }
    return Roles_1.Roles.NOBODY;
}
exports.nextPlayer = nextPlayer;
