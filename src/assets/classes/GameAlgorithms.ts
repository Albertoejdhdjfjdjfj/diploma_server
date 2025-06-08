import { GameDocument } from "../interfaces/Game";
import { Player } from "../interfaces/Player";
import { GamePhase } from "../enums/GamePhase";
import { rolesDistribution,playersMin } from "../variables/variables";
import { Role } from "../interfaces/Role";
import { Roles } from "../enums/Roles";
import { PubSub } from "graphql-subscriptions";
import { SelectionController } from "./SelectionController";
import { DBController } from "./dbController";
import { GameValidator } from "./GameValidator";
import { rolesLine } from "../variables/variables";

export class GameAlgorithms{
     constructor(){}

     static determineReceiverRole(senderRole:string,phase:string,playerRoleName:string):string{
          switch(senderRole){
                   case Roles.LOVER:{
                    if(phase === GamePhase.NIGHT){
                         return Roles.LOVER
                    }
                    else{
                         return Roles.ALL
                    }
               }
                   case Roles.MAFIA:{
                    if(phase === GamePhase.NIGHT){
                         return Roles.MAFIA
                    }
                    else{
                         return Roles.ALL
                    }
               }
                   case Roles.DON: {
                    if(phase === GamePhase.NIGHT){
                         if(playerRoleName === Roles.DON){
                              return Roles.DON
                         }
                         if(playerRoleName === Roles.MAFIA){
                              return Roles.MAFIA
                         }
                    }
                    else{
                         return Roles.ALL
                    }
               }
                   case Roles.SHERIFF: {
                    if(phase === GamePhase.NIGHT){
                         return Roles.SHERIFF
                    }
                    else{
                         return Roles.ALL
                    }
               }
                   case Roles.DOCTOR:{
                    if(phase === GamePhase.NIGHT){
                         return Roles.DOCTOR
                    }
                    else{
                         return Roles.ALL
                    }
               }
                   case Roles.MANIAC:{
                    if(phase === GamePhase.NIGHT){
                         return Roles.MANIAC
                    }
                    else{
                         return Roles.ALL
                    }
               }       
          }
         
          return Roles.NOBODY
     }

     static getWordStartingWithAt(text:string):string | null {
          const regex = /@(\w+)/g;
          const matches = regex.exec(text);
          return matches ? matches[1] : null; 
     }

     static async selectionProcess(currentGame:GameDocument,playerId:string,targetId:string,pubsub:PubSub):Promise<GameDocument>{
     
          const playerRole:Role|undefined = DBController.getPlayerRoleById(currentGame,playerId);

          if(!playerRole){
               throw new Error("You are not a player in this game")
          }

          const targetRole:Role|undefined = DBController.getPlayerRoleById(currentGame,targetId);
     
          if((playerRole.name !== currentGame.roleInLine && playerRole.player.nickname !== currentGame.playerInLine?.nickname) || playerRole.player.nickname !== currentGame.playerInLine?.nickname){
               throw new Error("You can not select now");
          }
          
          if(targetRole && !GameValidator.validTarget(playerRole.name,targetRole.name,currentGame.phase)){
               throw new Error("You can not select this target"); 
          }
         
          switch(playerRole.name){
                    case Roles.LOVER: {
                       currentGame = await SelectionController.loverSelection(currentGame,playerRole,targetRole,pubsub);
                       break;
                    }
     
                    case Roles.MAFIA: {
                         currentGame = await SelectionController.mafiaSelection(currentGame,playerRole,targetRole,pubsub);
                         break;
                    }
     
                    case Roles.DON: {
                         currentGame = await SelectionController.donSelection(currentGame,playerRole,targetRole,pubsub);
                         break;
                    }
     
                    case Roles.SHERIFF: {
                         currentGame = await SelectionController.sheriffSelection(currentGame,playerRole,targetRole,pubsub);
                         break;
                    }
     
                    case Roles.DOCTOR: {
                         currentGame = await SelectionController.doctorSelection(currentGame,playerRole,targetRole,pubsub)
                         break;
                    }
     
                    case Roles.MANIAC: {
                         currentGame = await SelectionController.maniakSelection(currentGame,playerRole,targetRole,pubsub)
                         break;
                    }
               }
     
               return currentGame
     }

     static nextRoleInLine(currentGame: GameDocument): string {
     
          let currentRole:string=currentGame.roleInLine;

          if(currentRole===Roles.MAFIA){
             const players = currentGame.roles.filter((role: Role) => role.name === Roles.MAFIA || role.name === Roles.DON);
             const alibi = players.some((pl)=>pl.alibi===currentGame.round)
             const currentPlayerIndex = players.findIndex((role: Role) => role.player.nickname === currentGame.playerInLine?.nickname);
               
             if(currentPlayerIndex+1<players.length&&!alibi){
               return Roles.MAFIA
             }
          }
     
          const currentRoleIndex:number = rolesLine.indexOf(currentRole);

          let nextRoleIndex = currentRoleIndex + 1;

          if (nextRoleIndex >= rolesLine.length) {
               return Roles.NOBODY;
          } 
     
          for (let i = nextRoleIndex; i < rolesLine.length; i++) {
               const nextRole: string = rolesLine[i];
               if (currentGame.roles.some((role: Role) => role.name === nextRole)) {
                    currentRole = nextRole;
                    break;
               }
          }
          
          return currentRole;
     }

     static nextPlayer(currentGame: GameDocument):Player|null {
         const playerIndex: number = currentGame.players.findIndex((player: Player) => player.nickname === currentGame.playerInLine?.nickname);
         
         if (playerIndex + 1 > currentGame.players.length) {
             return null;
         }
     
         return currentGame.players[playerIndex + 1];
     }
 
     static nextPlayerInLine(currentGame: GameDocument):Player|null {
          let players: Array<Role>;

          if(currentGame.roleInLine===Roles.MAFIA){
               players = currentGame.roles.filter((role: Role) => role.name === Roles.MAFIA || role.name === Roles.DON);
               const currentPlayerIndex = players.findIndex((role: Role) => role.player.nickname === currentGame.playerInLine?.nickname);

               if(currentPlayerIndex+1<players.length){
                    return players[currentPlayerIndex+1].player
               }
          }

          const playerIndex = currentGame.roles.findIndex((role: Role) => role.name === currentGame.roleInLine);
      
          return currentGame.roles[playerIndex].player
      }

      static determinateKilled(currentGame:GameDocument):Array<Role>{
          const roles:Array<Role> = currentGame.roles.filter((role:Role)=> role.alive === false);
          return roles
      }

    static voting(players: Array<Player>): Player | null {
    const voteCount: { [key: string]: number } = {};

    players.forEach(player => {
        voteCount[player.nickname] = (voteCount[player.nickname] || 0) + 1;
    });

    let maxVotes = 0;
    let winner: Player | null = null;
    let winnerCount = 0;

    for (const [nickname, votes] of Object.entries(voteCount)) {
        if (votes > maxVotes) {
            maxVotes = votes;
            winner = players.find(player => player.nickname === nickname) || null;
            winnerCount = 1; 
        } else if (votes === maxVotes) {
            winnerCount++;
        }
    }

    return winnerCount > 1 ? null : winner;
}

     static distributeRoles(players: Player[]): Role[] {
          const playersWithRoles: Array<Role> = [];
          
          const availablePlayers = [...players];
     
          for (let role of rolesDistribution[availablePlayers.length - playersMin]) {
              for (let i = 0; i < role.num; i++) {
                  const index = Math.floor(Math.random() * availablePlayers.length);
                  const player: Player = availablePlayers[index];
      
                  playersWithRoles.push({ 
                      player: player,
                      name: role.name,
                      alive: true,
                      alibi: 0,
                      active:true,
                      treated:0,
                  });
      
                  availablePlayers.splice(index, 1);
              }
          }
      
          return playersWithRoles;
      }
}