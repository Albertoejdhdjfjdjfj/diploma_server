import { Role } from "../../interfaces/Role";
import { GameDocument } from "../../interfaces/Game";

export function getPlayerRole(currentGame: GameDocument,playerId:string,errorMessage:string):Role{
    const playerRole:Role|undefined = currentGame.roles.find((role:Role)=>role.user.playerId === playerId)

     if(!playerRole){
          throw new Error(errorMessage);
     }

     return playerRole
}
 