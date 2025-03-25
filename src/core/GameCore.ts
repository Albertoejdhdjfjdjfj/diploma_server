import { Role } from "../assets/schemas/Role";
import { Player } from "../assets/schemas/Player";
import { roles } from "../assets/variables/variables";
import { NewMessage } from "../assets/actions/gameActions";
import { NEW_MESSAGE } from "../assets/actions/actionsTypes";
import { GameModel,GameDocument } from '../assets/models/Game';
import { PubSub } from "graphql-subscriptions";

// export async function game(gameId:String):Promise<void>{
    
//     let end= false;
//     while(!end){
//         startNewRound(gameId)
//     }
// }

export async function startNewRound(gameId: String, pubsub: PubSub): Promise<void> {
    let currentGame: GameDocument | null = await GameModel.findById(gameId);
            
        currentGame = await GameModel.findByIdAndUpdate(gameId, {
            $push: {
                chat: {
                    player: {
                        nickname: "",
                        playerId: ""
                    },
                    content: "Hi all",
                }, 
            },
        }, { new: true }); 
         
        if(!currentGame){
            return
        }
        
        console.log(currentGame.chat)
      
        await pubsub.publish(NEW_MESSAGE, {message:{receiver:currentGame.players[0],chat:currentGame.chat}});
        
    }



export function distributeRoles(players: Player[]): Role[] {
     const playersWithRoles: Array<Role> = [];
     
     const availablePlayers = [...players];

     for (let role of roles) {
         for (let i = 0; i < role.num; i++) {
             if (availablePlayers.length === 0) {
                 break; 
             }
             
             const index = Math.floor(Math.random() * availablePlayers.length);
             const player: Player = availablePlayers[index];
 
             playersWithRoles.push({ 
                 user: player,
                 role: role.name,
                 alive: true,
                 alibi: false,
                 active:true,
             });
 
             availablePlayers.splice(index, 1);
         }
     }
 
     return playersWithRoles;
 }

 