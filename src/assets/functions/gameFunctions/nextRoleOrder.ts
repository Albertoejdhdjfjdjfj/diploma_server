import { Roles } from "../../enums/Roles";
import { Role } from "../../interfaces/Role";
import { GameDocument } from "../../interfaces/Game";
import { rolesOrder } from "../../variables/variables";

export function nextRoleOrder(currentGame: GameDocument): string {

     if (currentGame.roleOrder === Roles.MAFIA) {
          const mafia: Array<Role> = currentGame.roles.filter((role: Role) => role.name === Roles.MAFIA || role.name === Roles.DON);

          if (mafia.length !== currentGame.voting.length) {
               return currentGame.roleOrder
          }
     }

     const roleIndex:number = rolesOrder.indexOf(currentGame.roleOrder);
     const nextRoleIndex = roleIndex + 1;
      
     if (nextRoleIndex >= rolesOrder.length) {
          return Roles.NOBODY;
     } 

     for (let i = nextRoleIndex; i < rolesOrder.length; i++) {
          const nextRole: string = rolesOrder[i];
 
          if (currentGame.roles.some((role: Role) => role.name === nextRole)) {
               currentGame.roleOrder = nextRole;
               break;
          }
     }
     
     return currentGame.roleOrder;
}