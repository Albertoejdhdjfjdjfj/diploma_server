import { GameDocument } from "../interfaces/Game";
import { GamePhase } from "../enums/GamePhase";
import { DBController } from "./dbController";
import { Role } from "../interfaces/Role";
import { Roles } from "../enums/Roles";
import { PubController } from "./PubController";
import { PubSub } from "graphql-subscriptions";

export class SelectionController{
     constructor(){};

     static async loverSelection(currentGame:GameDocument,playerRole:Role,targetRole:Role,pubsub:PubSub):Promise<void>{

          if(currentGame.phase === GamePhase.NIGHT){
               if(targetRole.name===Roles.MAFIA || targetRole.name===Roles.DON){
                    const mafiaPlayers = currentGame.roles.filter(role => role.name === Roles.MAFIA || role.name === Roles.DON);

                    for (const mafiaRole of mafiaPlayers) {
                         currentGame = await DBController.addAlibi(currentGame, mafiaRole.user.playerId);
                    }
                                        
               }
               else{
                   currentGame = await DBController.addAlibi(currentGame,targetRole.user.playerId)
               }
          }
          else{
               currentGame = await DBController.addVote(currentGame,targetRole.user)
               currentGame = await DBController.addMessage(currentGame,playerRole.user,Roles.ALL,targetRole.user.nickname,GamePhase.VOTING,true);
          }
     
          await PubController.pubMessage(currentGame,pubsub)
     }

     static async mafiaSelection(currentGame:GameDocument,playerRole:Role,targetRole:Role,pubsub:PubSub):Promise<void>{
          currentGame = await DBController.addVote(currentGame,targetRole.user)

          if(currentGame.phase === GamePhase.NIGHT){
               currentGame = await DBController.addMessage(currentGame,playerRole.user,Roles.MAFIA,targetRole.user.nickname,GamePhase.NIGHT,true);
          }
          else{
               currentGame = await DBController.addMessage(currentGame,playerRole.user,Roles.ALL,targetRole.user.nickname,GamePhase.VOTING,true);
          } 

          await PubController.pubMessage(currentGame,pubsub)
     }

     static async donSelection(currentGame:GameDocument,playerRole:Role,targetRole:Role,pubsub:PubSub):Promise<void>{
          if(currentGame.roleOrder === Roles.DON){
               if(playerRole.alibi){
                    currentGame = await DBController.addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.DON,`You are blocked, your lover chose you`,GamePhase.NIGHT,true);
               }
               else{
                    currentGame = await DBController.addMessage(currentGame,playerRole.user,Roles.DON,targetRole.user.nickname,GamePhase.NIGHT,true)
               }
          }
          else{
               currentGame = await DBController.addVote(currentGame,targetRole.user);

               if(currentGame.phase === GamePhase.NIGHT){
                    currentGame = await DBController.addMessage(currentGame,playerRole.user,Roles.MAFIA,targetRole.user.nickname,GamePhase.NIGHT,true);
               }
               else{
                    currentGame = await DBController.addMessage(currentGame,playerRole.user,Roles.ALL,targetRole.user.nickname,GamePhase.VOTING,true);
               } 
          }

          await PubController.pubMessage(currentGame,pubsub)
     }

     static async sheriffSelection(currentGame:GameDocument,playerRole:Role,targetRole:Role,pubsub:PubSub):Promise<void>{
          currentGame = await DBController.addMessage(currentGame,playerRole.user,Roles.SHERIFF,targetRole.user.nickname,GamePhase.NIGHT,true);
          
          if(currentGame.phase === GamePhase.NIGHT){
               if(playerRole.alibi){
                    currentGame = await DBController.addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.SHERIFF,`You are blocked, your lover chose you`,GamePhase.NIGHT,true);
               }
               else{
                    if(targetRole.name === Roles.MAFIA){
                         currentGame = await DBController.addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.SHERIFF,`Yes,${targetRole.user.nickname} is mafia`,GamePhase.NIGHT,true);
                    }
                    else{
                         currentGame = await DBController.addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.SHERIFF,`No,${targetRole.user.nickname} is not mafia`,GamePhase.NIGHT,true);
                    }
               }
          }
          else{
               currentGame = await DBController.addVote(currentGame,targetRole.user);
          }

          await PubController.pubMessage(currentGame,pubsub)
     }
}