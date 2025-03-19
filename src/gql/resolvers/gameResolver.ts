import { GameModel,GameDocument } from '../../assets/models/Game';
import { GameRoomModel,GameRoomDocument } from '../../assets/models/GameRoom';
import { PubSub } from 'graphql-subscriptions';
import {distributeRoles} from '../../core/GameCore'
import { playersLimit } from '../../assets/variables/variables';
import { GAME_INITIATED,ROLE_ASSIGNED } from '../../assets/actions/gameActions';
import { InitGame,RoleAssigned } from '../../assets/actions/actionsTypes';

const pubsub = new PubSub();

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
          
                  const startedGame = new GameModel({
                      players: [...gameRoom.players],
                      observers: [...gameRoom.observers],
                  });
                  
                  // await startedGame.save();
      
                  pubsub.publish(GAME_INITIATED, { initGame:"Game has been initialized!"});
                  // await gameRoom.deleteOne();
          
                  return; 
              } catch (error) {
                  throw new Error((error as Error).message);
              }
          }
     }, 
     Subscription: {
        initGame: {        
            subscribe: () => pubsub.asyncIterableIterator(GAME_INITIATED),
        },
        roleAssign: {
            subscribe: () => pubsub.asyncIterableIterator(ROLE_ASSIGNED),  
        },
    }, 
};

module.exports = gameResolver;