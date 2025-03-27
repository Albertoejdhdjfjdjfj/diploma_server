import { GameModel} from '../../assets/models/Game';
import { GameDocument } from '../../assets/interfaces/Game';
import { GameRoomDocument } from '../../assets/interfaces/GameRoom';
import { GameRoomModel} from '../../assets/models/GameRoom';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { playersMin} from '../../assets/variables/variables';
import { NewMessage,AssignRole } from '../../assets/actions/actionsTypes';
import { NEW_MESSAGE,ASSIGNING_ROLE } from '../../assets/actions/actionsList';
import { game } from '../../core/GameCore';
import { decodeToken } from '../../assets/functions/decodeToken';
import { Role } from '../../assets/interfaces/Role';
import { Roles } from '../../assets/enums/Roles';
import { addMessage } from '../../assets/functions/addMessage';
export const pubsub = new PubSub();

const gameResolver = {
    Query: {   
     
    },
    Mutation: {
      startGame: async (_: any, args: any, context: any): Promise<void> => {
              try {
                  const { user } = context; 
                  const { id } = args; 
          
                  const gameRoom: GameRoomDocument | null = await GameRoomModel.findById(id);
      
                  if (!gameRoom) {
                      throw new Error("The Game room does not exist");
                  }
      
                  if(user.id!== gameRoom.creator.creatorId){
                      throw new Error("You are not creator of this game");
                  }
      
                  if(gameRoom.players.length<playersMin){
                      throw new Error("Not enough players");
                  }
          
                  const startedGame:GameDocument = new GameModel({
                      players: [...gameRoom.players],
                      observers: [...gameRoom.observers],
                  });
                  
                  const savedGame=await startedGame.save();
    
                  // await gameRoom.deleteOne();
                  game(startedGame.id,pubsub)
                  return savedGame.id
              } catch (error) {
                  throw new Error((error as Error).message);
              }
          },
          sendMessage: async (_: any, args: any, context: any): Promise<void> => {
            try {
                const { user } = context; 
                const { id,content } = args; 
        
                const game: GameDocument | null = await GameModel.findById(id);
    
                if (!game) {
                    throw new Error("The Game does not exist");
                }

                const playerRole:Role|undefined = game.roles.find((role:Role)=>role.user.playerId === user.id)
    
                if(playerRole){
                    throw new Error("You are not player");
                }
    
                if(playerRole !== game.order || game.order !== Roles.ALL){
                    throw new Error("It is not your order to talk");
                }
        
                await addMessage(id,user.)
                
            } catch (error) {
                throw new Error((error as Error).message);
            }
          }
          
     }, 
     Subscription: {
        message: {
            subscribe: withFilter<NewMessage>(
                () => pubsub.asyncIterableIterator(NEW_MESSAGE),
                (payload: NewMessage | undefined, variables) => {
                    if (!payload) {
                        return false; 
                    }
                    const decodedToken = decodeToken(variables.token); 
                    return decodedToken.id === payload.message.receiverId
                }
            ),
        },
        role: {
            subscribe: withFilter<AssignRole>(
                () => pubsub.asyncIterableIterator(ASSIGNING_ROLE),
                (payload: AssignRole|undefined, variables) => {
                    if (!payload) {
                        return false; 
                    }
                    const decodedToken = decodeToken(variables.token); 
                    return decodedToken.id === payload.role.receiverId
                }
            ),
        },


    }, 
};

module.exports = gameResolver;