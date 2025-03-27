import { filterChat } from "./filterChat";
import { NEW_MESSAGE } from "../actions/actionsList";
import { PubSub } from "graphql-subscriptions";
import { GameDocument } from "../interfaces/Game";
import { GameModel } from "../models/Game";

export async function publishMessage(gameId:string ,pubsub:PubSub):Promise<void>{
     let currentGame: GameDocument | null = await GameModel.findById(gameId);

     if(!currentGame){
          throw new Error("The Game does not exist");
     }

     for(let role of currentGame.roles){
             await pubsub.publish(NEW_MESSAGE, {message:{receiverId:role.user.playerId,chat:filterChat(currentGame.chat,role.role)}});
     }
}