import { GameDocument } from "../interfaces/Game";
import { Role } from "../interfaces/Role";
import { GameModel } from "../models/Game"

export async function addRoles(gameId:string,roles:Array<Role>):Promise<GameDocument|null>{
     return await GameModel.findByIdAndUpdate(gameId, {
          $push: {
              roles: roles 
          },
      }, { new: true }); 
}