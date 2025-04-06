import { GameDocument } from "../../interfaces/Game";
import { Role } from "../../interfaces/Role";

export function determinateKilled(currentGame:GameDocument):Array<Role>{
    const roles:Array<Role> = currentGame.roles.filter((role:Role)=> role.alive === false)
    return roles
}