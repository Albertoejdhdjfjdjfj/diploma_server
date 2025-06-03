import { GamePhase } from "../enums/GamePhase"
import { Roles } from "../enums/Roles"
import { Role } from "../interfaces/Role"
import { Game } from "../interfaces/Game"
import { Player } from "../interfaces/Player"
import { filterChat } from "./filterChat"

export function promtGenerator(role:string,sender:Player,currentGame:Game):string{
   const phase = currentGame.phase;
   const chat = currentGame.chat;
   const playersList = JSON.stringify(currentGame.players)
   const mafia = JSON.stringify(currentGame.roles.filter((role: Role) => role.name === Roles.MAFIA || role.name === Roles.DON));

  if(phase===GamePhase.VOTING){
      return `You are a player with the nickname ${sender.nickname} in the mafia game, your role in the game is ${role}. Here is the chat of the game ${filterChat(chat, role)} and the list of players ${playersList}, analyze your last discussion in the messages, who is the mafia, just don't choose yorself. Write the '@' symbol without a space and the nickname of the player you will vote for.`
  }

  if(phase===GamePhase.NIGHT){
     if(role===Roles.MAFIA){
         return `
You are a player with the nickname ${sender.nickname} in the mafia game, your role in the game is ${role}. Here is the chat of the game ${filterChat(chat,role)} and the list of players ${playersList}, analyze and write a message who you want to choose tonight, just don't choose these players ${mafia} and yorself. When writing a player's nickname, add the "@" symbol without a space in front of the nickname. Don't impersonate a real person when sending text messages.`
     }
     return `You are a player with the nickname ${sender.nickname} in the mafia game, Your role is ${role} in the game. Here is the chat of the game ${filterChat(chat,role)} and the list of players ${playersList}, analyze and write a message who you want to choose tonight, just don't choose yorself. When writing the player's nickname, add the '@' symbol without a space before the nickname. Don't impersonate yourself and write like a real person when texting.`
  }

     return `You are a player with the nickname ${sender.nickname} in the mafia game, Your role is ${role} in the game. Here is the chat of the game ${filterChat(chat,role)} and the list of players ${playersList}, analyze and write a message about your suspicions about who the mafia is, just don't choose yorself. Don't impersonate yourself and write like a real person when texting.`
}