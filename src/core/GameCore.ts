import { NEW_MESSAGE,ASSIGNING_ROLE } from "../assets/actions/actionsTypes";
import { GameModel,GameDocument } from '../assets/models/Game';
import { PubSub } from "graphql-subscriptions";
import { distributeRoles } from "../assets/functions/distributeRoles";

// export async function game(gameId:String):Promise<void>{
    
//     let end= false;
//     while(!end){
//         startNewRound(gameId)
//     }
// }

export async function startNewRound(gameId: String, pubsub: PubSub): Promise<void> {
    let currentGame: GameDocument | null = await GameModel.findById(gameId);
    if(!currentGame){
        return
    }
    if(!currentGame.rounds){
        currentGame = await GameModel.findByIdAndUpdate(gameId, {
            $push: {
                chat: {
                    player: {
                        nickname: "",
                        playerId: ""
                    },
                    content: "Hello everyone, the game has started and you will be assigned the appropriate role",
                }, 
            },
        }, { new: true }); 

        if(!currentGame){
            return
        }
         
        for(let player of currentGame.players){
            await pubsub.publish(NEW_MESSAGE, {message:{receiver:player,chat:currentGame.chat}});
        }

        let roles = distributeRoles(currentGame.players);

        for(let role of roles){
            await pubsub.publish(ASSIGNING_ROLE, {role:{receiver:role.user,role:role.role}});
        }

        currentGame = await GameModel.findByIdAndUpdate(gameId, {
            $push: {
                roles: roles 
            },
        }, { new: true }); 
    }

    currentGame = await GameModel.findByIdAndUpdate(gameId, {
        $inc: {
            rounds: 1
        }
    }, { new: true });  

    if(!currentGame){
        return
    }

    for(let player of currentGame.players){
        await pubsub.publish(NEW_MESSAGE, {message:{receiver:player,chat:currentGame.chat}});
    }
    
}
