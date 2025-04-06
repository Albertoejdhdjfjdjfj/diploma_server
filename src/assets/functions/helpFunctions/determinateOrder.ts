import { Role } from "../../interfaces/Role";
import { GameDocument } from "../../interfaces/Game";
import { rolesOrder } from "../../variables/variables";
import { updateGame } from "../dbFunctions/updateGame";
import { GamePhase } from "../../enums/GamePhase";

export async function determinateOrder(currentGame:GameDocument):Promise<GameDocument>{ 
       const roleIndex:number = rolesOrder.indexOf(currentGame.roleOrder);
       const nextRoleIndex = roleIndex + 1;
     
       if (nextRoleIndex >= rolesOrder.length) {
          currentGame.roleOrder = "";
          currentGame.playerOrder = "";
          currentGame.phase = GamePhase.DAY
       } else {
          for (let i = nextRoleIndex; i < rolesOrder.length; i++) {
               const nextRole: string = rolesOrder[i];

               if (currentGame.roles.some((role: Role) => role.name === nextRole)) {
                    currentGame.roleOrder = nextRole;
                    break;
               }
          }
       }

       return await updateGame(currentGame)
}