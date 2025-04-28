import { GameModel} from '../../assets/models/Game';
import { GameDocument } from '../../assets/interfaces/Game';
import { GameRoomDocument } from '../../assets/interfaces/GameRoom';
import { GameRoomModel} from '../../assets/models/GameRoom';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { playersMin} from '../../assets/variables/variables';
import { NewMessage,AssignRole } from '../../assets/actions/actionsTypes';
import { NEW_MESSAGE,ASSIGNING_ROLE } from '../../assets/actions/actionsList';
import { decodeToken } from '../../assets/functions/helpFunctions/decodeToken';
import { Role } from '../../assets/interfaces/Role';
import { Roles } from '../../assets/enums/Roles';
import { DecodedToken } from '../../assets/interfaces/DecodedToken';
import { determinateReceiver } from '../../assets/functions/gameFunctions/determinateReceiver';
import { selectionProcess } from '../../assets/functions/gameFunctions/selectionProcess';
import { Player } from '../../assets/interfaces/Player';
import { getPlayerRole } from '../../assets/functions/helpFunctions/getPlayerRole';
import { GameCore } from '../../core/GameCore';
import { DBController } from '../../assets/classes/dbController';
import { PubController } from '../../assets/classes/PubController';

const pubsub = new PubSub();

const gameResolver = {
    Query: {   
     
    },
    Mutation: {
      startGame: async(_: any, args:any,player:Player): Promise<void> => {
              try {
                  const { id } = args; 
          
                  const gameRoom: GameRoomDocument | null = await GameRoomModel.findById(id);
      
                  if (!gameRoom) {
                      throw new Error("The Game room does not exist");
                  }
                  

                  if(player.playerId!== gameRoom.creator.playerId){
                      throw new Error("You are not creator of this game");
                  }
      
                  if(gameRoom.players.length<playersMin){
                      throw new Error("Not enough players");
                  }
          
                  const startedGame:GameDocument = new GameModel({

                      players: [...gameRoom.players],
                      observers: [...gameRoom.observers],
                  });
                  
                  const savedGame:GameDocument=await startedGame.save();
    
                  // await gameRoom.deleteOne();

                  new GameCore(savedGame,pubsub).game()
              } catch (error) {
                  throw new Error((error as Error).message); 
              }
          },

          sendMessage: async (_: any, args: {content:string}, player: Player): Promise<void> => {
            try {
                const { content } = args; 
                const currentGame: GameDocument | null = await GameModel.findOne({
                    players: { playerId: player.playerId } 
                }).exec();

                if (!currentGame) {
                    throw new Error("The Game does not exist");
                }

                const playerRole:Role = getPlayerRole(currentGame,player.playerId,"You are not player");
    
                if(playerRole.name !== currentGame.role || playerRole.user.nickname !== currentGame.player){
                    throw new Error("It is not your order to talk");
                }
                
                const receiver = determinateReceiver(playerRole.name,currentGame.phase,currentGame.role);

                if(receiver === Roles.NOBODY){
                    throw new Error("You can not talk");
                }
                
                await DBController.addMessage(currentGame,player,receiver,content,currentGame.phase,false) 
                await PubController.pubMessage(currentGame,pubsub)
            } catch (error) {
                throw new Error((error as Error).message);
            }
          },

          sendSelection: async (_: any, args: {targetId:string}, player: Player): Promise<void> => {
            try {
                const { targetId } = args; 
                console.log(player)
                let currentGame: GameDocument | null = await GameModel.findOne({
                    players: { $elemMatch: { playerId: player.playerId }}
                });

                if (!currentGame) {
                    throw new Error("The Game does not exist");
                }

                currentGame=await selectionProcess(currentGame,player.playerId,targetId,pubsub)
                new GameCore(currentGame,pubsub).game()
            } catch (error) {
                throw new Error((error as Error).message);
            }
          }
    }, 
     Subscription: {
        message: {
            subscribe: withFilter<NewMessage>(
                () => pubsub.asyncIterableIterator(NEW_MESSAGE),
                (payload: NewMessage | undefined, variables:{token:string}) => {
                    if (!payload) {
                        return false; 
                    }

                    const token=variables.token.split(' ')[1];
                    const data = decodeToken(token)
                    return data.userId === payload.message.receiverId   
                }
            ),
        },
        role: {
            subscribe: withFilter<AssignRole>(
                () => pubsub.asyncIterableIterator(ASSIGNING_ROLE),
                (payload: AssignRole|undefined, variables:{token:string}) => {
                    if (!payload) {
                        return false; 
                    }

                    const token=variables.token.split(' ')[1];
                    const data = decodeToken(token)
                    return data.userId === payload.role.receiverId 
                }
            ),
        },
    }, 
};

module.exports = gameResolver;