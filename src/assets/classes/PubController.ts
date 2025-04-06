import { GameDocument } from "../interfaces/Game";
import { PubSub } from "graphql-subscriptions";
import { NEW_MESSAGE,ASSIGNING_ROLE } from "../actions/actionsList";
import { filterChat } from "../functions/helpFunctions/filterChat";

export class PubController{
     constructor(){}

    static async pubMessage(currentGame: GameDocument ,pubsub:PubSub):Promise<void>{
         for(let role of currentGame.roles){
                 await pubsub.publish(NEW_MESSAGE, {message:{receiverId:role.user.playerId,chat:filterChat(currentGame.chat,role.name)}});
         }
    }

     static async pubRoles(currentGame: GameDocument ,pubsub:PubSub):Promise<void>{
         for(let role of currentGame.roles){
              await pubsub.publish(ASSIGNING_ROLE, {role:{receiverId:role.user.playerId,role:role.name}});
         }
    }
}