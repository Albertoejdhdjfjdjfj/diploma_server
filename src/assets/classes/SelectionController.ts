import { GameDocument } from "../interfaces/Game";
import { GamePhase } from "../enums/GamePhase";
import { DBController } from "./dbController";
import { Role } from "../interfaces/Role";
import { Roles } from "../enums/Roles";
import { PubController } from "./PubController";
import { PubSub } from "graphql-subscriptions";

export class SelectionController{
     constructor(){};

     static async loverSelection(currentGame:GameDocument,playerRole:Role,targetRole:Role,pubsub:PubSub):Promise<boolean>{
          if(targetRole.alibi === currentGame.round - 1){
               currentGame = await DBController.addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.LOVER,'You can notchoose a target for 2 nights in a row',GamePhase.NIGHT,true);
               return false;
          }

          if(currentGame.phase === GamePhase.NIGHT){
               if(targetRole.name===Roles.MAFIA){
                    const mafiaPlayers = currentGame.roles.filter(role => role.name === Roles.MAFIA);

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
          return true;
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
          if(currentGame.role === Roles.DON){
               currentGame = await DBController.addMessage(currentGame,playerRole.user,Roles.DON,targetRole.user.nickname,GamePhase.NIGHT,true)

               if(targetRole.name === Roles.MAFIA){
                    currentGame = await DBController.addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.DON,`Yes,${targetRole.user.nickname} is sheriff`,GamePhase.NIGHT,true);
               }
               else{
                    currentGame = await DBController.addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.DON,`No,${targetRole.user.nickname} is not sheriff`,GamePhase.NIGHT,true);
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
                    if(targetRole.name === Roles.MAFIA){
                         currentGame = await DBController.addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.SHERIFF,`Yes,${targetRole.user.nickname} is mafia`,GamePhase.NIGHT,true);
                    }
                    else{
                         currentGame = await DBController.addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.SHERIFF,`No,${targetRole.user.nickname} is not mafia`,GamePhase.NIGHT,true);
                    }
          }
          else{
               currentGame = await DBController.addVote(currentGame,targetRole.user);
          }

          await PubController.pubMessage(currentGame,pubsub)
     }

     static async doctorSelection(currentGame:GameDocument,playerRole:Role,targetRole:Role,pubsub:PubSub):Promise<void>{
          currentGame = await DBController.addMessage(currentGame,playerRole.user,Roles.DOCTOR,targetRole.user.nickname,GamePhase.NIGHT,true);

          if(currentGame.phase === GamePhase.NIGHT){
               if(targetRole.name === Roles.DOCTOR && targetRole.treated){
                    currentGame = await DBController.addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.DOCTOR,"You are was treated",GamePhase.NIGHT,true)
               }
               else{
                    currentGame = await DBController.addMessage(currentGame,playerRole.user,Roles.DOCTOR,targetRole.user.nickname,GamePhase.NIGHT,true);
                    if(targetRole.name === Roles.LOVER){
                         const targetRoleLover:Role|undefined = currentGame.roles.find((role:Role)=>role.alibi === currentGame.round);

                         if(targetRoleLover){
                              currentGame = await DBController.setCure(currentGame,targetRoleLover.user.playerId)
                         }

                         currentGame = await DBController.setCure(currentGame,playerRole.user.playerId)         
                    }
               }
          }
          else{
               currentGame.voting.push(targetRole.user)
          }

          await PubController.pubMessage(currentGame,pubsub)
     }
}