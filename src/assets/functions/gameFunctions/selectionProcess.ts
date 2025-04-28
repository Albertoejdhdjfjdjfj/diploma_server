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
     const targetRole:Role|undefined = currentGame.roles.find((role:Role)=>role.user.playerId === targetId);

     if(!(playerRole.user.nickname !== currentGame.player ||
        playerRole.name !== currentGame.role ||
        currentGame.phase == GamePhase.DAY)
     ){
          throw new Error("You can not select now");
     }
     
     if(targetRole && !targetValidator(playerRole.name,targetRole.name,currentGame.phase)){
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