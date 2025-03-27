import { GameDocument } from "../interfaces/Game"
import { GameModel } from "../models/Game"

export async function addMessage(gameId:string,senderName:string,senderId:string,receiver:string,content:String):Promise<GameDocument | null>{
     return await GameModel.findByIdAndUpdate(gameId, {
             $push: {
                 chat: {
                     sender:{
                              user: {
                                 nickname: senderName,
                                 playerId: senderId
                             }
                     },
                     receiver:receiver,
                     content: content,
                 }, 
             },
         }, { new: true })
}