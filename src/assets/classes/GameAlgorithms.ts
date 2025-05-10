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
                   case Roles.LOVER: return phase === GamePhase.NIGHT? Roles.LOVER:Roles.ALL
                   case Roles.MAFIA: return phase === GamePhase.NIGHT? Roles.MAFIA:Roles.ALL
                   case Roles.DON: return (phase ===  GamePhase.VOTING || phase ===  GamePhase.DISCUSSION)? Roles.ALL:playerRoleName === Roles.MAFIA? Roles.MAFIA:Roles.DON
                   case Roles.SHERIFF: return phase === GamePhase.NIGHT? Roles.SHERIFF:Roles.ALL
                   case Roles.DOCTOR: phase === GamePhase.NIGHT? Roles.DOCTOR:Roles.ALL
                   case Roles.MANIAC: phase === GamePhase.NIGHT? Roles.MANIAC:Roles.ALL         
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

     static nextPlayerInLine(currentGame: GameDocument):Player|null {
         const playerIndex: number = currentGame.players.findIndex((player: Player) => player.nickname === currentGame.playerInLine?.nickname);
         
         if (playerIndex >= currentGame.players.length - 1) {
             return null;
         }
     
         return currentGame.players[playerIndex + 1];
     }

     static nextMafiaPlayerInLine(currentGame: GameDocument):Player|null {
          const mafia: Array<Role> = currentGame.roles.filter((role: Role) => role.name === Roles.MAFIA || role.name === Roles.DON);
      
          if (mafia.length !== currentGame.voting.length) {
               const currentPlayerIndex = mafia.findIndex((role: Role) => role.player.nickname === currentGame.playerInLine?.nickname);
               return mafia[currentPlayerIndex+1].player;
          } 
      
          return null
      }

      static determinateKilled(currentGame:GameDocument):Array<Role>{
          const roles:Array<Role> = currentGame.roles.filter((role:Role)=> role.alive === false);
          return roles
      }

      static voting(players:Array<Player>):Player|null {     
          const voteCount: { [key: string]: number } = {};
      
          players.forEach(player => {
              if (player.nickname in voteCount) {
                  voteCount[player.nickname]++;
              } else {
                  voteCount[player.nickname] = 1;
              }
          });
      
          
          let winner: Player | null = null;
          let maxVotes = 0;
      
          for (const [nickname, votes] of Object.entries(voteCount)) {
              if (votes > maxVotes) {
                  maxVotes = votes;
                  winner = players.find(player => player.nickname === nickname) || null; 
              }
          }
     
          return winner
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