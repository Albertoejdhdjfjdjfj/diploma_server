import { Roles } from "../../enums/Roles";
import { Role } from "../../interfaces/Role";
import { GameDocument } from "../../interfaces/Game";
import { rolesOrder } from "../../variables/variables";

export function nextRole(currentGame: GameDocument): string {

     let order:string=currentGame.role;

     const roleIndex:number = rolesOrder.indexOf(currentGame.role);
     let nextRoleIndex = roleIndex + 1;
      
     if (nextRoleIndex >= rolesOrder.length) {
          return Roles.NOBODY;
     } 

     for (let i = nextRoleIndex; i < rolesOrder.length; i++) {
          const nextRole: string = rolesOrder[i];
          
          if (currentGame.roles.some((role: Role) => role.name === nextRole)) {
                    order = nextRole;
                    break;
          }
     }
     
     return order;
}