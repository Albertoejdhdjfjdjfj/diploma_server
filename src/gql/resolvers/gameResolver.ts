import { GameRoomModel,GameRoomDocument } from '../../assets/models/GameRoom';
import { GameModel,GameDocument } from '../../assets/models/Game';

const gameResolver = {
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
      createGameRoom:async(_: any, args:any,context:any): Promise<GameRoomDocument> =>{
        try {
        const {user}=context;
        const {name}=args;
        const userGames:GameRoomDocument|null = await GameRoomModel.findOne({
          $or: [
              { "creator.creatorId": user.id },
              { name: name }
          ]});

        if(userGames){
          throw new Error('You already have an active game room')
        }

        const newGame = new GameRoomModel({name:name, creator:{creatorId:user.id,nickname:user.nickname}});
        await newGame.save();
        return newGame;
      } catch (error) {
        throw new Error((error as Error).message);
    }
      },
      joinGameRoom: async (_: any, args: any, context: any): Promise<GameRoomDocument> => {
        try {
            const { user } = context; 
            const { id } = args; 

            const gameRoom: GameRoomDocument | null = await GameRoomModel.findById(id);
            if (!gameRoom) {
                throw new Error("The Game room does not exist");
            }
    
            const userGames: GameRoomDocument | null = await GameRoomModel.findOne({
                "creator.creatorId": user.id,
            });
    
            const joinGames: GameRoomDocument | null = await GameRoomModel.findOne({
                "players.playerId": user.id
            });
    
            if (userGames && userGames.id !== gameRoom.id || joinGames) {
                throw new Error('You already have an active game room');
            }
    
            const playerExists = gameRoom.players.some(player => player.playerId === user.id);
            if (playerExists) {
                throw new Error("You are already in the game room");
            }
    
            gameRoom.players.push({
                playerId: user.id,
                nickname: user.nickname 
            });
    
            const updatedGameRoom = await gameRoom.save();
            return updatedGameRoom; 
        } catch (error) {
            throw new Error((error as Error).message);
        }
    },

      leaveGameRoom: async (_: any, args: any, context: any): Promise<GameRoomDocument> => {
        try {
            const { user } = context; 
            const { id } = args; 

            const gameRoom: GameRoomDocument | null = await GameRoomModel.findById(id);
    
            if (!gameRoom) {
                throw new Error("The Game room does not exist");
            }
    
            const playerIndex = gameRoom.players.findIndex(player => player.playerId === user.id);
    
            if (playerIndex === -1) {
                throw new Error("You are not in this game room");
            }
    
            gameRoom.players.splice(playerIndex, 1);
    
            const updatedGameRoom = await gameRoom.save();
    
            return updatedGameRoom; 
        } catch (error) {
            throw new Error((error as Error).message);
        }
    },

    startGame:async (_: any, args: any, context: any): Promise<void> => {
      try{
        const { user } = context; 
        const { id } = args; 

        const gameRoom: GameRoomDocument | null = await GameRoomModel.findById(id);

        if (!gameRoom) {
            throw new Error("The Game room does not exist");
        }

        const startedGame = new GameModel({players: [...gameRoom.players]});

        await gameRoom.deleteOne;

        return ;
      }
      catch(error){
        throw new Error((error as Error).message);
      }
    }
    }, 
};

module.exports = gameResolver;