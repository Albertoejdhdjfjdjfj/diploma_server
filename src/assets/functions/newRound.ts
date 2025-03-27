import { GameDocument } from "../interfaces/Game"
import { GameModel } from "../models/Game"

export async function newRound(gameId:string):Promise<GameDocument | null>{
     return await GameModel.findByIdAndUpdate(gameId, {
             $inc: {
                 rounds: 1
             }
     }, { new: true })
}