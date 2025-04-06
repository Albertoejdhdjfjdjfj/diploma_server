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

     static async addMessage(currentGame:GameDocument,sender:Player,receiverRole:string,content:string,phase:string=GamePhase.DAY,isSelect:boolean=false,errorMessage:string = "The Game does not exist"):Promise<GameDocument>{
          currentGame.chat.push({
             sender:sender,
             receiverRole:receiverRole,
             content:content,
             phase:phase,
             isSelect:isSelect
          })
     
          return DBController.updateGame(currentGame,errorMessage)      
     }

     static async setRoles(currentGame:GameDocument,roles:Array<Role>,errorMessage:string = "The Game does not exist"):Promise<GameDocument>{
         currentGame.roles=roles
         return DBController.updateGame(currentGame,errorMessage)      
     }

     static async newRound(currentGame:GameDocument,errorMessage:string = "The Game does not exist"):Promise<GameDocument>{
          currentGame.round = currentGame.round+1;
          return DBController.updateGame(currentGame,errorMessage)      
     }

     static async setPlayerOrder(currentGame:GameDocument,playerId:string,errorMessage:string = "The Game does not exist"):Promise<GameDocument>{
          currentGame.playerOrder = playerId;
          return DBController.updateGame(currentGame,errorMessage)      
     }

     static async setRoleOrder(currentGame:GameDocument,role:string,errorMessage:string = "The Game does not exist"):Promise<GameDocument>{
          currentGame.roleOrder = role;
          return DBController.updateGame(currentGame,errorMessage)      
     }

     static async setPhase(currentGame:GameDocument,phase:string,errorMessage:string = "The Game does not exist"):Promise<GameDocument>{
          currentGame.phase = phase;
          return DBController.updateGame(currentGame,errorMessage)      
     }

     static async cleanVoting(currentGame:GameDocument,errorMessage:string = "The Game does not exist"):Promise<GameDocument>{
          currentGame.voting=[];
          return DBController.updateGame(currentGame,errorMessage)      
     }

     static async addVote(currentGame:GameDocument,player:Player,errorMessage:string = "The Game does not exist"):Promise<GameDocument>{
          currentGame.voting.push(player)
          return DBController.updateGame(currentGame,errorMessage)      
     }

     static async deletePlayer(currentGame:GameDocument,playerId:string,errorMessage:string = "The Game does not exist"):Promise<GameDocument>{
         currentGame.roles = currentGame.roles.filter((role:Role)=>role.user.playerId !== playerId);
         currentGame.players = currentGame.players.filter((player:Player)=>player.playerId !== playerId);
         return DBController.updateGame(currentGame,errorMessage)
     }

     static async addPlayerToObservers(currentGame:GameDocument,player:Player,errorMessage:string = "The Game does not exist"):Promise<GameDocument>{
          currentGame.observers.push(player);
          return DBController.updateGame(currentGame,errorMessage)
     }
     
     static async addAlibi(currentGame:GameDocument,playerId:string,errorMessage:string = "The Game does not exist"):Promise<GameDocument>{
          const playerIndex:number = currentGame.roles.findIndex((role:Role)=>role.user.playerId === playerId)
          if(playerIndex === -1){
               throw new Error("The  not a player in this game")
          }
          currentGame.roles[playerIndex].alibi=true;
     
          return DBController.updateGame(currentGame,errorMessage)
     }

     static getPlayerRole(currentGame:GameDocument,playerId:string,errorMessage:string = "The Game does not exist"):Role{
          const playerRole:Role|undefined = currentGame.roles.find((role:Role)=>role.user.playerId === playerId);
          if(!playerRole){
               throw new Error(errorMessage);
          }
          return playerRole
     }
}