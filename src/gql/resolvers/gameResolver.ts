import { GameModel} from '../../assets/models/Game';
import { GameDocument } from '../../assets/interfaces/Game';
import { GameRoomDocument } from '../../assets/interfaces/GameRoom';
import { GameRoomModel} from '../../assets/models/GameRoom';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { playersMin} from '../../assets/variables/variables';
import { NewMessage,AssignRole } from '../../assets/actions/actionsTypes';
import { NEW_MESSAGE,ASSIGNING_ROLE } from '../../assets/actions/actionsList';
import { game } from '../../core/GameCore';
import { decodeToken } from '../../assets/functions/helpFunctions/decodeToken';
import { Role } from '../../assets/interfaces/Role';
import { Roles } from '../../assets/enums/Roles';
import { addMessage } from '../../assets/functions/dbFunctions/addMessage';
import { determinateReceiver } from '../../assets/functions/gameFunctions/determinateReceiver';
import { publishMessage } from '../../assets/functions/publishFunctions/publishMessage';
import { selectionProcess } from '../../assets/functions/gameFunctions/selectionProcess';
import { votingProcess } from '../../assets/functions/gameFunctions/votingProcess';
import { DecodedToken } from '../../assets/interfaces/DecodedToken';
import { Player } from '../../assets/interfaces/Player';
import { getPlayerRole } from '../../assets/functions/helpFunctions/getPlayerRole';

const pubsub = new PubSub();

const gameResolver = {
    Query: {   
     
    },
    Mutation: {
      startGame: async (_: any, args: any, player: Player): Promise<void> => {
              try {
                  const { id } = args; 
          
                  const gameRoom: GameRoomDocument | null = await GameRoomModel.findById(id);
      
                  if (!gameRoom) {
                      throw new Error("The Game room does not exist");
                  }
      
                  if(player.playerId!== gameRoom.creator.creatorId){
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

          sendMessage: async (_: any, args: {id:string,content:string}, player: Player): Promise<void> => {
            try {
                const { id,content } = args; 
        
                const currentGame: GameDocument | null = await GameModel.findById(id);
    
                if (!currentGame) {
                    throw new Error("The Game does not exist");
                }

                const playerRole:Role = getPlayerRole(currentGame,player.playerId,"You are not player");
    
                if(playerRole.name !== currentGame.roleOrder){
                    throw new Error("It is not your roleOrder to talk");
                }
                
                const receiver = determinateReceiver(playerRole.name,currentGame.phase,currentGame.roleOrder);

                if(receiver === Roles.NOBODY){
                    throw new Error("You can not talk");
                }
                
                await addMessage(currentGame,player,receiver,content,currentGame.phase,false) 
                await publishMessage(currentGame,pubsub)
            } catch (error) {
                throw new Error((error as Error).message);
            }
          },

          sendSelection: async (_: any, args: {id:string,targetId:string}, player: Player): Promise<void> => {
            try {
                const { id,targetId} = args; 
        
                let currentGame: GameDocument | null = await GameModel.findById(id);
    
                if (!currentGame) {
                    throw new Error("The Game does not exist");
                }

                await selectionProcess(currentGame,player.playerId,targetId,pubsub)
                await votingProcess(currentGame,pubsub)
                await game(currentGame,pubsub)
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
                    const decodedToken:DecodedToken = decodeToken(variables.token); 
                    return decodedToken.userId === payload.message.receiverId
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
                    const decodedToken:DecodedToken = decodeToken(variables.token); 
                    return decodedToken.userId === payload.role.receiverId
                }
            ),
        },


    }, 
};

module.exports = gameResolver;