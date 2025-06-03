import { GameRoomModel} from '../../assets/models/GameRoom';
import { GameRoomDocument } from '../../assets/interfaces/GameRoom';
import { playersMax,playersMin } from '../../assets/variables/variables';
import { Player } from '../../assets/interfaces/Player';
import { PubSub,} from 'graphql-subscriptions';
import { UPDATE_GAME_ROOM } from '../../assets/actions/actionsList';

const pubsub = new PubSub();

const gameRoomResolver = {
    Query: {    
      getGameRooms:async(_:any,args:any):Promise<Array<GameRoomDocument>> =>{
          try {
                const { sort, page = 1, limit=5 } = args;
                const skip = (page - 1) * limit;
                const regex = new RegExp(sort, 'i');

                const games = await GameRoomModel.find({
                  $or: [
                      { name: { $regex: regex } },
                      { "creator.nickname": { $regex: regex } }
                  ]
              }) 
              .skip(skip)
              .limit(limit);

              return games;
            } catch (error) {
                throw new Error((error as Error).message);
            }
      }     
    },
    Mutation: {
      createGameRoom:async(_: any, args:any,player:Player): Promise<GameRoomDocument> =>{
        try {
        const {name}=args;
        const userGames:GameRoomDocument|null = await GameRoomModel.findOne({ "creator.playerId": player.playerId });

        if(userGames){
          throw new Error('You already have an game room ')
        }

        const newGame = new GameRoomModel({name:name, creator:{playerId:player.playerId,nickname:player.nickname}});
        const savedGame =  await newGame.save();
        pubsub.publish(UPDATE_GAME_ROOM, { updatedGameRoom: savedGame });
        return newGame;
       }
        catch (error) {
        throw new Error((error as Error).message);
       }
      },
      joinGameRoom: async (_: any, args: any, player: Player): Promise<GameRoomDocument> => {
        try {
            const { id } = args; 

            const gameRoom: GameRoomDocument | null = await GameRoomModel.findById(id);
            
            if (!gameRoom) {
                throw new Error("The Game room does not exist");
            }
    
            const userGames: GameRoomDocument | null = await GameRoomModel.findOne({
                "creator.playerId": player.playerId,
            });
    
            const joinGames: GameRoomDocument | null = await GameRoomModel.findOne({
                "players.playerId": player.playerId,
            });
    
            // if (userGames && userGames.id !== gameRoom.id || joinGames) {
            //     throw new Error('You already have an active game room');
            // }
    
            const playerExists = gameRoom.players.some(player => player.playerId === player.playerId);
            // if (playerExists) {
            //     throw new Error("You are already in the game room");
            // }
            
            if(gameRoom.players.length>=playersMax){
            gameRoom.observers.push({
                playerId: player.playerId,
                nickname: player.nickname 
            })
            
            const updatedGameRoom = await gameRoom.save();
            return updatedGameRoom; 
            }

            gameRoom.players.push({
                playerId: player.playerId,
                nickname: player.nickname 
            });

            const savedGameRoom = await gameRoom.save();
            pubsub.publish(UPDATE_GAME_ROOM, { updatedGameRoom: savedGameRoom });
            return savedGameRoom; 
        } catch (error) {
            throw new Error((error as Error).message);
        }
    },

    leaveGameRoom: async (_: any, args: any, player: Player): Promise<GameRoomDocument> => {
        try { 
            const { id } = args; 

            const gameRoom: GameRoomDocument | null = await GameRoomModel.findById(id);
    
            if (!gameRoom) {
                throw new Error("The Game room does not exist");
            }
    
            let playerIndex = gameRoom.players.findIndex(player => player.playerId === player.playerId);
    
            if (playerIndex === -1) {
                playerIndex = gameRoom.observers.findIndex(player => player.playerId === player.playerId);
                if (playerIndex === -1){
                    throw new Error("You are not in this game room");
                }
            }
    
            gameRoom.players.splice(playerIndex, 1);
    
            const updatedGameRoom = await gameRoom.save();
            pubsub.publish(UPDATE_GAME_ROOM, { updatedGameRoom: updatedGameRoom });
            return updatedGameRoom; 
        } catch (error) {
            throw new Error((error as Error).message);
        }
     }
   },
    Subscription: {
        updatedGameRoom:{
            subscribe: () => pubsub.asyncIterableIterator(UPDATE_GAME_ROOM),
        },
        
    }    

};

module.exports = gameRoomResolver; 