import { GameDocument } from "../../interfaces/Game"
import { Roles } from "../../enums/Roles";
import { Role } from "../../interfaces/Role";
import { GamePhase } from "../../enums/GamePhase";
import { PubSub } from "graphql-subscriptions";
import { targetValidator } from "../validators/targetValidator";
import { DBController } from "../../classes/dbController";
import { SelectionController } from "../../classes/selectionController";



export async function selectionProcess(currentGame:GameDocument,playerId:string,targetId:string,pubsub:PubSub):Promise<GameDocument>{

     const playerRole:Role = DBController.getPlayerRole(currentGame,playerId,"You are not a player in this game");
     const targetRole:Role = DBController.getPlayerRole(currentGame,targetId,"Target is not a player in this game");

     if(playerRole.user.nickname !== currentGame.playerOrder ||
        playerRole.name !== currentGame.roleOrder ||
        currentGame.phase == GamePhase.DAY
     ){
          throw new Error("You can not select now");
     }
     
     if(!targetValidator(playerRole.name,targetRole.name,currentGame.phase)){
          throw new Error("You can not select this target");
     }
    
     switch(playerRole.name){
               case Roles.LOVER: {
                  await SelectionController.loverSelection(currentGame,playerRole,targetRole,pubsub);
                  break;
               }

               case Roles.MAFIA: {
                    await SelectionController.mafiaSelection(currentGame,playerRole,targetRole,pubsub);
                    break;
               }

               case Roles.DON: {
                    await SelectionController.donSelection(currentGame,playerRole,targetRole,pubsub);
                    break;
               }

               case Roles.SHERIFF: {
                    await SelectionController.sheriffSelection(currentGame,playerRole,targetRole,pubsub);
                    break;
               }

               case Roles.DOCTOR: {
                    if(currentGame.roleOrder === Roles.DOCTOR){
                         if(playerRole.alibi){
                              currentGame = await addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.DOCTOR,`You are blocked, your lover chose you`,GamePhase.NIGHT,true);
                         }
                         else{
                              if(targetRole.name === Roles.DOCTOR && targetRole.treated){
                                   currentGame = await addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.DOCTOR,"You are was treated",GamePhase.NIGHT,true)
                              }
                              else{
                                   currentGame = await addMessage(currentGame,playerRole.user,Roles.DOCTOR,targetRole.user.nickname,GamePhase.NIGHT,true);
                              }
                         }
                    }
                    else if(currentGame.playerOrder === playerRole.user.nickname){
                         currentGame.voting.push(targetRole.user)
                    }
                    break;
               }

               case Roles.MANIAC: {
                    if(currentGame.roleOrder === Roles.MANIAC){
                         if(playerRole.alibi){
                              currentGame = await addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.MANIAC,`You are blocked, your lover chose you`,GamePhase.NIGHT,true);
                         }
                         else{
                              if(targetRole.name === Roles.MANIAC){
                                   currentGame = await addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.DOCTOR,"You are was treated",GamePhase.NIGHT,true)
                              }
                              else{
                                   currentGame = await addMessage(currentGame,playerRole.user,Roles.DOCTOR,targetRole.user.nickname,GamePhase.NIGHT,true);
                              }
                         }
                    }
                    else if(currentGame.playerOrder === playerRole.user.nickname){
                         currentGame.voting.push(targetRole.user)
                    }
                    break;
               }
          }

          return await updateGame(currentGame)
}