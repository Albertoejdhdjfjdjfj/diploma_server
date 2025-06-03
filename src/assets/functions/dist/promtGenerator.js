"use strict";
exports.__esModule = true;
exports.promtGenerator = void 0;
var GamePhase_1 = require("../enums/GamePhase");
var Roles_1 = require("../enums/Roles");
var filterChat_1 = require("./filterChat");
function promtGenerator(role, sender, currentGame) {
    var phase = currentGame.phase;
    var chat = currentGame.chat;
    var playersList = JSON.stringify(currentGame.players);
    var mafia = JSON.stringify(currentGame.roles.filter(function (role) { return role.name === Roles_1.Roles.MAFIA || role.name === Roles_1.Roles.DON; }));
    if (phase === GamePhase_1.GamePhase.VOTING) {
        return "You are a player with the nickname " + sender.nickname + " in the mafia game, your role in the game is " + role + ". Here is the chat of the game " + filterChat_1.filterChat(chat, role) + " and the list of players " + playersList + ", analyze your last discussion in the messages, who is the mafia, just don't choose yorself. Write the '@' symbol without a space and the nickname of the player you will vote for.";
    }
    if (phase === GamePhase_1.GamePhase.NIGHT) {
        if (role === Roles_1.Roles.MAFIA) {
            return "\nYou are a player with the nickname " + sender.nickname + " in the mafia game, your role in the game is " + role + ". Here is the chat of the game " + filterChat_1.filterChat(chat, role) + " and the list of players " + playersList + ", analyze and write a message who you want to choose tonight, just don't choose these players " + mafia + " and yorself. When writing a player's nickname, add the \"@\" symbol without a space in front of the nickname. Don't impersonate a real person when sending text messages.";
        }
        return "You are a player with the nickname " + sender.nickname + " in the mafia game, Your role is " + role + " in the game. Here is the chat of the game " + filterChat_1.filterChat(chat, role) + " and the list of players " + playersList + ", analyze and write a message who you want to choose tonight, just don't choose yorself. When writing the player's nickname, add the '@' symbol without a space before the nickname. Don't impersonate yourself and write like a real person when texting.";
    }
    return "You are a player with the nickname " + sender.nickname + " in the mafia game, Your role is " + role + " in the game. Here is the chat of the game " + filterChat_1.filterChat(chat, role) + " and the list of players " + playersList + ", analyze and write a message about your suspicions about who the mafia is, just don't choose yorself. Don't impersonate yourself and write like a real person when texting.";
}
exports.promtGenerator = promtGenerator;
