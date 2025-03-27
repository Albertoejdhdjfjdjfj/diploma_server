import { GameModel} from '../../assets/models/Game';
import { GameDocument } from '../../assets/interfaces/Game';
import { GameRoomDocument } from '../../assets/interfaces/GameRoom';
import { GameRoomModel} from '../../assets/models/GameRoom';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { playersLimit } from '../../assets/variables/variables';
import { NewMessage,AssignRole } from '../../assets/actions/gameActions';
import { NEW_MESSAGE,ASSIGNING_ROLE } from '../../assets/actions/actionsTypes';
import { startNewRound } from '../../core/GameCore';
import { decodeToken } from '../../assets/functions/decodeToken';
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
      
                  if(gameRoom.players.length<playersLimit){
                      throw new Error("Not enough players");
                  }
          
                  const startedGame:GameDocument = new GameModel({
                      players: [...gameRoom.players],
                      observers: [...gameRoom.observers],
                  });
                  
                  await startedGame.save();
    
                  // await gameRoom.deleteOne();
                  startNewRound(startedGame.id,pubsub)
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
                    return decodedToken.id === payload.message.receiver.playerId
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
                    return decodedToken.id === payload.role.receiver.playerId
                }
            ),
        },


    }, 
};

module.exports = gameResolver;