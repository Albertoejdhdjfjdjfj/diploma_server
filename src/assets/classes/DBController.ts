import { GameDocument } from "../interfaces/Game";
import { Player } from "../interfaces/Player";
import { GamePhase } from "../enums/GamePhase";
import { GameModel } from "../models/Game";
import { Role } from "../interfaces/Role";

export class DBController{
     constructor(){}

     private static async updateGame(currentGame:GameDocument,errorMessage:string = "The Game does not exist"):Promise<GameDocument>{
          const updatedGame:GameDocument|null = await GameModel.findByIdAndUpdate(currentGame.id, currentGame, { new: true });
           
          if(!updatedGame){
               throw new Error(errorMessage);
          }

          return updatedGame; 
     }

     static async deleteGame(currentGame: GameDocument, delay: number = 0): Promise<void> {
          await new Promise(resolve => setTimeout(resolve, delay));
          await GameModel.findByIdAndDelete(currentGame.id);   
      }

     static async addMessage(currentGame: GameDocument, sender: Player, receiverRole: string, content: string, delay: number = 0): Promise<GameDocument> {
          await new Promise(resolve => setTimeout(resolve, delay));
      
          currentGame.chat.push({
              sender: sender,
              receiverRole: receiverRole,
              content: content,
              phase: currentGame.phase
          });
      
          return DBController.updateGame(currentGame);
      }

     static async setRoles(currentGame:GameDocument,roles:Array<Role>):Promise<GameDocument>{
         currentGame.roles=roles
         return DBController.updateGame(currentGame)      
     }

     static async newRound(currentGame:GameDocument):Promise<GameDocument>{
          currentGame.round = currentGame.round+1;
          return DBController.updateGame(currentGame)      
     }

     static async setPlayerInLine(currentGame:GameDocument,player:Player|null):Promise<GameDocument>{
          currentGame.playerInLine = player;
          return DBController.updateGame(currentGame);      
     }

     static async setRoleInLine(currentGame:GameDocument,role:string):Promise<GameDocument>{
          currentGame.roleInLine = role;
          return DBController.updateGame(currentGame)      
     }

     static async setPhase(currentGame:GameDocument,phase:string):Promise<GameDocument>{
          currentGame.phase = phase;
          return DBController.updateGame(currentGame)      
     }

     static async cleanVoting(currentGame:GameDocument):Promise<GameDocument>{
          currentGame.voting=[];
          return DBController.updateGame(currentGame)      
     }

     static async addVote(currentGame:GameDocument,player:Player):Promise<GameDocument>{
          currentGame.voting.push(player)
          return DBController.updateGame(currentGame)      
     }

     static async deletePlayer(currentGame:GameDocument,playerId:string):Promise<GameDocument>{
         currentGame.roles = currentGame.roles.filter((role:Role)=>role.player.playerId !== playerId);
         currentGame.players = currentGame.players.filter((player:Player)=>player.playerId !== playerId);
         return DBController.updateGame(currentGame)
     }

     static async addPlayerToObservers(currentGame:GameDocument,player:Player):Promise<GameDocument>{
          currentGame.observers.push(player);
          return DBController.updateGame(currentGame)
     }
     
     static async addAlibi(currentGame:GameDocument,playerId:string):Promise<GameDocument>{
          const playerIndex:number = currentGame.roles.findIndex((role:Role)=>role.player.playerId === playerId)
          if(playerIndex === -1){
               throw new Error("There is no such player in the game")
          }
          currentGame.roles[playerIndex].alibi=currentGame.round;
     
          return DBController.updateGame(currentGame)
     }

     static getPlayerRoleById(currentGame:GameDocument,playerId:string):Role|undefined{
          const playerRole:Role|undefined = currentGame.roles.find((role:Role)=>role.player.playerId === playerId);
          return playerRole
     }

     static getPlayerById(currentGame:GameDocument,playerId:string):Player|undefined{
          const player:Player|undefined = currentGame.players.find((pl:Player)=>pl.playerId === playerId)
          return player;
     }

     static getPlayerByName(currentGame:GameDocument,playerName:string):Player|undefined{
          const player:Player|undefined = currentGame.players.find((pl:Player)=>pl.nickname === playerName)
          return player;
     }

     static async setCure(currentGame:GameDocument,playerId:string):Promise<GameDocument>{
          const playerIndex:number = currentGame.roles.findIndex((role:Role)=>role.player.playerId === playerId);

          if(playerIndex === -1){
               throw new Error("There is no such player in the game")
          }

          currentGame.roles[playerIndex].alive=true;
          currentGame.roles[playerIndex].treated = currentGame.round;

          return DBController.updateGame(currentGame)      
     }

     static async setKill(currentGame:GameDocument,playerId:string):Promise<GameDocument>{
          const playerIndex:number = currentGame.roles.findIndex((role:Role)=>role.player.playerId === playerId);

          if(playerIndex === -1){
               throw new Error("There is no such player in the game")
          }

          currentGame.roles[playerIndex].alive=false;
          return DBController.updateGame(currentGame)      
     }
}