import { GameModel} from '../../assets/models/Game';
import { GameDocument } from '../../assets/interfaces/Game';
import { GameRoomDocument } from '../../assets/interfaces/GameRoom';
import { GameRoomModel} from '../../assets/models/GameRoom';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { playersMin} from '../../assets/variables/variables';
import { NewMessage, ActiveGame } from '../../assets/actions/actionsTypes';
import { NEW_MESSAGE,ACTIVE_GAME} from '../../assets/actions/actionsList';
import { decodeToken } from '../../assets/functions/decodeToken';
import { Role } from '../../assets/interfaces/Role';
import { filterChat } from '../../assets/functions/filterChat';
import { GameAlgorithms } from '../../assets/classes/GameAlgorithms';
import { Player } from '../../assets/interfaces/Player';
import { GameCore } from '../../core/GameCore';
import { DBController } from '../../assets/classes/dbController';
import { PubController } from '../../assets/classes/PubController';
import { Message } from '../../assets/interfaces/Message';
import { SelectionController } from '../../assets/classes/SelectionController';
import { GamePhase } from '../../assets/enums/GamePhase';

const pubsub = new PubSub();

const gameResolver = {
    Query: {   
        getMessages: async (_: any, args: {gameId:string}, player: Player): Promise<Array<Message>> => {
            try {
                const { gameId } = args;
                const currentGame: GameDocument | null = await GameModel.findById(gameId)

                if (!currentGame) {
                    throw new Error("The Game does not exist");
                }

                const playerInGame:Player|undefined = DBController.getPlayerById(currentGame,player.playerId)

                if (!playerInGame) {
                    throw new Error("You are not player in this game");
                }
 
                const playerRole:Role|undefined = DBController.getPlayerRoleById(currentGame,player.playerId);
                
                if(!playerRole){
                    return currentGame.chat
                }

                return filterChat(currentGame.chat,playerRole.name)
            } catch (error) {
                throw new Error((error as Error).message);
            }
          },
          getPlayers: async (_: any, args: {gameId:string}, player: Player): Promise<{players:Array<Player>,observers:Array<Player>}> => {
            try {
                const { gameId } = args; 
                const currentGame: GameDocument | null = await GameModel.findById(gameId)

                if (!currentGame) {
                    throw new Error("The Game does not exist");
                }

                const playerInGame:Player|undefined = DBController.getPlayerById(currentGame,player.playerId)

                if (!playerInGame) {
                    throw new Error("You are not player in this game");
                }

                return {players:currentGame.players,observers:currentGame.observers}
            } catch (error) {
                throw new Error((error as Error).message);
            }
          },
          
          getActiveGame: async (_: any,args:any, player: Player): Promise<{gameId:string|null}> => {
            try { 
                const currentGame: GameDocument|null = await GameModel.findOne({
                
                    "players.playerId": player.playerId
                    
                })

                return {gameId:currentGame?currentGame.id:null}
            } catch (error) {
                throw new Error((error as Error).message);
            }
          },
    },
    Mutation: {
      startGame: async(_: any, args:{id:string},player:Player): Promise<string> => {
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

                  new GameCore(savedGame,pubsub).game();
                  PubController.pubActiveGame(savedGame,pubsub)
                  return savedGame.id
              } catch (error) {
                  throw new Error((error as Error).message); 
              }
          },
          sendMessage: async (_: any, args: {content:string,gameId:string}, player: Player): Promise<void> => {
            try {
                const { content,gameId } = args; 
                let currentGame: GameDocument | null = await GameModel.findById(gameId)

                if (!currentGame) {
                    throw new Error("The Game does not exist");
                }

                const playerRole:Role|undefined = DBController.getPlayerRoleById(currentGame,player.playerId);
                if(!playerRole){
                    throw new Error("You are not player in this game");
                }

                if((playerRole.name !== currentGame.roleInLine && playerRole.player.nickname !== currentGame.playerInLine?.nickname) || playerRole.player.nickname !== currentGame.playerInLine?.nickname){
                    throw new Error("It is not your order to talk");
                }
                
                const receiver = GameAlgorithms.determineReceiverRole(playerRole.name,currentGame.phase,currentGame.roleInLine)
                const target = GameAlgorithms.getWordStartingWithAt(content);

                if(target){
                    const targetId:string|undefined = DBController.getPlayerByName(currentGame,target)?.playerId
                    if(!targetId){
                        throw new Error("Target is not player in this game");
                    }

                    if(currentGame.phase===GamePhase.NIGHT){
                        currentGame =await GameAlgorithms.selectionProcess(currentGame,player.playerId,targetId,pubsub)
                    }else{
                        currentGame =await GameAlgorithms.votingProcess(currentGame,player.playerId,targetId,pubsub)
                    }
                     new GameCore(currentGame,pubsub).game()
                     return
                }

                await DBController.addMessage(currentGame,player,receiver,content) 
                await PubController.pubMessage(currentGame,pubsub)
                if(currentGame.phase === GamePhase.DISCUSSION){
                     new GameCore(currentGame,pubsub).game()
                }
            } catch (error) {
                throw new Error((error as Error).message);
            }
          }
},
 
     Subscription: {
        newMessage: {
            subscribe: withFilter<NewMessage>(
                () => pubsub.asyncIterableIterator(NEW_MESSAGE),
                (payload: NewMessage | undefined, variables:{token:string,gameId:string}) => {
                    if (!payload) {
                        return false; 
                    }
                    const token=variables.token.split(' ')[1];
                    const data = decodeToken(token);
                    return (data.userId === payload.newMessage.receiverId&&variables.gameId === payload.newMessage.gameId)   
                }
            )
        },
        activeGame:{
            subscribe: withFilter<ActiveGame>(
                () => pubsub.asyncIterableIterator(ACTIVE_GAME),
                (payload: ActiveGame|undefined, variables:{token:string}) => {
                    if (!payload) {
                        return false; 
                    }
                    
                    const token=variables.token.split(' ')[1];
                    const data = decodeToken(token)
                    return (data.userId === payload.activeGame.receiverId) 
                }
            ),
        }
    }
};

module.exports = gameResolver;