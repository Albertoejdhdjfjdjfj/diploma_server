import { GameDocument } from "../interfaces/Game";
import { GamePhase } from "../enums/GamePhase";
import { DBController } from "./dbController";
import { Role } from "../interfaces/Role";
import { Roles } from "../enums/Roles";
import { PubController } from "./PubController";
import { PubSub } from "graphql-subscriptions";

export class SelectionController{
     constructor(){};

     static async loverSelection(currentGame:GameDocument,playerRole:Role,targetRole:Role|undefined,pubsub:PubSub):Promise<GameDocument>{
          if(!targetRole){
               throw new Error("You have to choose");  
          }

          if(targetRole.name === Roles.MANIAC){
               throw new Error("You can not choose yourself");
          }
          
          if(targetRole.alibi === currentGame.round - 1){
               throw new Error("You can not choose one player 2 times in a row.") 
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
          return currentGame;
     }

     static async mafiaSelection(currentGame:GameDocument,playerRole:Role,targetRole:Role|undefined,pubsub:PubSub):Promise<GameDocument>{
          if(!targetRole){
               throw new Error("You have to choose");  
          }

          currentGame = await DBController.addVote(currentGame,targetRole.user)

          if(currentGame.phase === GamePhase.NIGHT){
               currentGame = await DBController.addMessage(currentGame,playerRole.user,Roles.MAFIA,targetRole.user.nickname,GamePhase.NIGHT,true);
          }
          else{
               currentGame = await DBController.addMessage(currentGame,playerRole.user,Roles.ALL,targetRole.user.nickname,GamePhase.VOTING,true);
          } 

          await PubController.pubMessage(currentGame,pubsub)
          return currentGame;
     }

     static async donSelection(currentGame:GameDocument,playerRole:Role,targetRole:Role|undefined,pubsub:PubSub):Promise<GameDocument>{
          if(!targetRole){
               throw new Error("You have to choose");  
          }

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
          return currentGame;
     }

     static async sheriffSelection(currentGame:GameDocument,playerRole:Role,targetRole:Role|undefined,pubsub:PubSub):Promise<GameDocument>{ 
          if(!targetRole){
               throw new Error("You have to choose");  
          }

          if(currentGame.phase === GamePhase.NIGHT){
               currentGame = await DBController.addMessage(currentGame,playerRole.user,Roles.SHERIFF,targetRole.user.nickname,GamePhase.NIGHT,true);

               if(targetRole.name === Roles.MAFIA){
                    currentGame = await DBController.addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.SHERIFF,`Yes,${targetRole.user.nickname} is mafia`,GamePhase.NIGHT,true);
               }
               else{
                    currentGame = await DBController.addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.SHERIFF,`No,${targetRole.user.nickname} is not mafia`,GamePhase.NIGHT,true);
               }
          }
          else{
               currentGame = await DBController.addVote(currentGame,targetRole.user);
               currentGame = await DBController.addMessage(currentGame,playerRole.user,Roles.ALL,targetRole.user.nickname,GamePhase.NIGHT,true);
          }

          await PubController.pubMessage(currentGame,pubsub)
          return currentGame;
     }

     static async doctorSelection(currentGame:GameDocument,playerRole:Role,targetRole:Role|undefined,pubsub:PubSub):Promise<GameDocument>{
          if(!targetRole){
               throw new Error("You have to choose");  
          }

          if(currentGame.phase === GamePhase.NIGHT){
               
               if(targetRole.name === Roles.DOCTOR&&targetRole.treated){
                     throw new Error("You are was treated") 
               }

               if(targetRole.treated == currentGame.round - 1){
                     throw new Error("You can not heal one player 2 times in a row");
               }
               
               if(targetRole.name === Roles.LOVER){
                    const targetRoleLover:Role|undefined = currentGame.roles.find((role:Role)=>role.alibi === currentGame.round);

                    if(targetRoleLover){
                         currentGame = await DBController.setCure(currentGame,targetRoleLover.user.playerId)
                    }         
               }

               currentGame = await DBController.setCure(currentGame,targetRole.user.playerId)
               currentGame = await DBController.addMessage(currentGame,playerRole.user,Roles.DOCTOR,targetRole.user.nickname,GamePhase.NIGHT,true);
          }
          else{
               currentGame.voting.push(targetRole.user)
               currentGame = await DBController.addMessage(currentGame,playerRole.user,Roles.ALL,targetRole.user.nickname,GamePhase.VOTING,true);
          }

          await PubController.pubMessage(currentGame,pubsub)
          return currentGame;
     }

     static async maniakSelection(currentGame:GameDocument,playerRole:Role,targetRole:Role|undefined,pubsub:PubSub):Promise<GameDocument>{
          if(!targetRole && currentGame.phase === GamePhase.NIGHT){
               currentGame = await DBController.addMessage(currentGame,playerRole.user,Roles.MANIAC,"I do not choose anyone.",GamePhase.NIGHT,true);
          }else{
               if(!targetRole){
                    throw new Error("You have to choose");  
               }

               if(targetRole.name === Roles.MANIAC){
                    throw new Error("You can not kill yourself");
               }

               if(currentGame.phase === GamePhase.NIGHT){
                    currentGame = await DBController.setKill(currentGame,targetRole.user.playerId)
                    currentGame = await DBController.addMessage(currentGame,playerRole.user,Roles.MANIAC,targetRole.user.nickname,GamePhase.NIGHT,true);
               }
               else{
                    currentGame = await DBController.addVote(currentGame,targetRole.user);
                    currentGame = await DBController.addMessage(currentGame,playerRole.user,Roles.ALL,targetRole.user.nickname,GamePhase.NIGHT,true);
               }
          }

          await PubController.pubMessage(currentGame,pubsub)
          return currentGame;
     }
}