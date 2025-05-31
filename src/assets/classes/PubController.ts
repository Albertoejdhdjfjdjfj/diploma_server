import { GameDocument } from "../interfaces/Game";
import { PubSub } from "graphql-subscriptions";
import { NEW_MESSAGE,ACTIVE_GAME} from "../actions/actionsList";
import { filterMessage } from "../functions/helpFunctions/filterMessage";
import { Message } from "../interfaces/Message";

export class PubController{
     constructor(){}

    static async pubMessage(currentGame: GameDocument ,pubsub:PubSub):Promise<void>{
          const lastMessage:Message = currentGame.chat[currentGame.chat.length-1]
         for(let role of currentGame.roles){
               if(lastMessage){
                 await pubsub.publish(NEW_MESSAGE, {newMessage:{receiverId:role.player.playerId,message:filterMessage(lastMessage,role.name) ,gameId:currentGame.id}});
               }
         }
    }

       static async pubActiveGame(currentGame: GameDocument ,pubsub:PubSub):Promise<void>{
         for(let player of currentGame.players){
                 await pubsub.publish(ACTIVE_GAME, {activeGame:{receiverId:player.playerId,gameId:currentGame.id}});
         }
    }
}