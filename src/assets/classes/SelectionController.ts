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

          if(targetRole.name === Roles.LOVER || targetRole.player.playerId === playerRole.player.playerId){
               throw new Error("You can not choose yourself or sameone with the same role");
          }
          
          if((targetRole.alibi === currentGame.round - 1)&&(targetRole.alibi-1>0)){
               throw new Error("You can not choose one player 2 times in a row.") 
          }

          if(currentGame.phase === GamePhase.NIGHT){
               if(targetRole.name===Roles.MAFIA){
                    const mafiaPlayers = currentGame.roles.filter(role => (role.name === Roles.MAFIA));

                    for (const mafiaRole of mafiaPlayers) {
                         currentGame = await DBController.addAlibi(currentGame, mafiaRole.player.playerId);
                    }   
                    currentGame = await DBController.addMessage(currentGame,playerRole.player,Roles.LOVER,targetRole.player.nickname);                            
               }
               else if(targetRole.name===Roles.DON){
                    const mafiaPlayers = currentGame.roles.filter(role => (role.name === Roles.MAFIA)||(role.name === Roles.DON));
     
                    for (const mafiaRole of mafiaPlayers) {
                         currentGame = await DBController.addAlibi(currentGame, mafiaRole.player.playerId);
                    }
                    currentGame = await DBController.addMessage(currentGame,playerRole.player,Roles.LOVER,targetRole.player.nickname);
               }
               else{
                   currentGame = await DBController.addMessage(currentGame,playerRole.player,Roles.LOVER,targetRole.player.nickname);
                   currentGame = await DBController.addAlibi(currentGame,targetRole.player.playerId)
               }
          }
          else{
               currentGame = await DBController.addVote(currentGame,targetRole.player)
               currentGame = await DBController.addMessage(currentGame,playerRole.player,Roles.ALL,targetRole.player.nickname);
          }
     
          await PubController.pubMessage(currentGame,pubsub)
          return currentGame;
     }

     static async mafiaSelection(currentGame:GameDocument,playerRole:Role,targetRole:Role|undefined,pubsub:PubSub):Promise<GameDocument>{
          if(!targetRole){
               throw new Error("You have to choose");  
          }

          if(targetRole.name === Roles.MAFIA || targetRole.player.playerId === playerRole.player.playerId){
               throw new Error("You can not choose yourself or sameone with the same role");
          }

          currentGame = await DBController.addVote(currentGame,targetRole.player)

          if(currentGame.phase === GamePhase.NIGHT){
               currentGame = await DBController.addMessage(currentGame,playerRole.player,Roles.MAFIA,targetRole.player.nickname);
          }
          else{
               currentGame = await DBController.addMessage(currentGame,playerRole.player,Roles.ALL,targetRole.player.nickname);
          } 

          await PubController.pubMessage(currentGame,pubsub)
          return currentGame;
     }

     static async donSelection(currentGame:GameDocument,playerRole:Role,targetRole:Role|undefined,pubsub:PubSub):Promise<GameDocument>{
          if(!targetRole){
               throw new Error("You have to choose");  
          }

          if(targetRole.name === Roles.MAFIA || targetRole.name === Roles.DON || targetRole.player.playerId === playerRole.player.playerId){
               throw new Error("You can not choose yourself or sameone with the same role");
          }

          if(currentGame.roleInLine === Roles.DON){
               currentGame = await DBController.addMessage(currentGame,playerRole.player,Roles.DON,targetRole.player.nickname)

               if(targetRole.name === Roles.SHERIFF){
                    currentGame = await DBController.addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.DON,`Yes,${targetRole.player.nickname} is sheriff`);
               }
               else{
                    currentGame = await DBController.addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.DON,`No,${targetRole.player.nickname} is not sheriff`);
               }
          } 
          else{
               currentGame = await DBController.addVote(currentGame,targetRole.player);

               if(currentGame.phase === GamePhase.NIGHT){
                    currentGame = await DBController.addMessage(currentGame,playerRole.player,Roles.MAFIA,targetRole.player.nickname);
               }
               else{
                    currentGame = await DBController.addMessage(currentGame,playerRole.player,Roles.ALL,targetRole.player.nickname);
               } 
          }

          await PubController.pubMessage(currentGame,pubsub)
          return currentGame;
     }

     static async sheriffSelection(currentGame:GameDocument,playerRole:Role,targetRole:Role|undefined,pubsub:PubSub):Promise<GameDocument>{ 
          if(!targetRole){
               throw new Error("You have to choose");   
          }

          if(targetRole.name === Roles.SHERIFF || targetRole.player.playerId === playerRole.player.playerId){
               throw new Error("You can not choose yourself or sameone with the same role");
          }

          if(currentGame.phase === GamePhase.NIGHT){
               currentGame = await DBController.addMessage(currentGame,playerRole.player,Roles.SHERIFF,targetRole.player.nickname);

               if(targetRole.name === Roles.MAFIA || targetRole.name === Roles.DON){
                    currentGame = await DBController.addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.SHERIFF,`Yes,${targetRole.player.nickname} is mafia`);
               }
               else{
                    currentGame = await DBController.addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.SHERIFF,`No,${targetRole.player.nickname} is not mafia`);
               }
          }
          else{
               currentGame = await DBController.addVote(currentGame,targetRole.player);
               currentGame = await DBController.addMessage(currentGame,playerRole.player,Roles.ALL,targetRole.player.nickname);
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
                         currentGame = await DBController.setCure(currentGame,targetRoleLover.player.playerId)
                    }         
               }

               currentGame = await DBController.setCure(currentGame,targetRole.player.playerId)
               currentGame = await DBController.addMessage(currentGame,playerRole.player,Roles.DOCTOR,targetRole.player.nickname);
          }
          else{
               currentGame.voting.push(targetRole.player)
               currentGame = await DBController.addMessage(currentGame,playerRole.player,Roles.ALL,targetRole.player.nickname);
          }

          await PubController.pubMessage(currentGame,pubsub)
          return currentGame;
     }

     static async maniakSelection(currentGame:GameDocument,playerRole:Role,targetRole:Role|undefined,pubsub:PubSub):Promise<GameDocument>{
          if(!targetRole && currentGame.phase === GamePhase.NIGHT){
               currentGame = await DBController.addMessage(currentGame,playerRole.player,Roles.MANIAC,"I do not choose anyone.");
          }else{
               if(!targetRole){
                    throw new Error("You have to choose");  
               }

               if(targetRole.name === Roles.MANIAC || targetRole.player.playerId === playerRole.player.playerId){
                    throw new Error("You can not choose yourself or sameone with the same role");
               }

               if(currentGame.phase === GamePhase.NIGHT){
                    currentGame = await DBController.setKill(currentGame,targetRole.player.playerId)
                    currentGame = await DBController.addMessage(currentGame,playerRole.player,Roles.MANIAC,targetRole.player.nickname);
               }
               else{
                    currentGame = await DBController.addVote(currentGame,targetRole.player);
                    currentGame = await DBController.addMessage(currentGame,playerRole.player,Roles.ALL,targetRole.player.nickname);
               }
          }

          await PubController.pubMessage(currentGame,pubsub)
          return currentGame;
     }
}