import { GameModel} from '../assets/models/Game';
import { GameDocument } from "../assets/interfaces/Game";
import { PubSub } from "graphql-subscriptions";
import { distributeRoles } from "../assets/functions/distributeRoles";
import { addMessage } from "../assets/functions/addMessage";
import { publishMessage } from "../assets/functions/publishMessage";
import {Roles} from "../assets/enums/Roles"
import { publishRoles } from "../assets/functions/publishRoles";
import { addRoles } from "../assets/functions/addRoles";
import { newRound } from "../assets/functions/newRound";

export async function game(gameId: string, pubsub: PubSub):Promise<void>{
       await startNewRound(gameId,pubsub)
    
}

export async function startNewRound(gameId: string, pubsub: PubSub): Promise<void> {
    let currentGame: GameDocument | null = await GameModel.findById(gameId);

    if(!currentGame){
        return
    }

    if(!currentGame.rounds){
        currentGame=await addMessage(gameId,"admin","admin",Roles.ALL,"Hello everyone, the game has started and you will be assigned the appropriate role")
        await publishMessage(gameId,pubsub);

        if(!currentGame){
            return
        }

        let roles = distributeRoles(currentGame.players);
        await publishRoles(roles,pubsub);
        currentGame=await addRoles(gameId,roles)
    }

    if(!currentGame){
        return
    }
    currentGame = await newRound(gameId);

    if(!currentGame){
        return
    }

    currentGame = await addMessage(gameId,"admin","admin",Roles.ALL,`Round ${currentGame.rounds + 1}`) 
   

    if(!currentGame){
        return
    }

    await publishMessage(gameId,pubsub)
}
