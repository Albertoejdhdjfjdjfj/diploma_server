import { GameDocument } from "../../interfaces/Game";
import { Roles } from "../../enums/Roles";
import { Role } from "../../interfaces/Role";
import { Player } from "../../interfaces/Player";


export function nextPlayerOrder(currentGame: GameDocument):string {

    if (currentGame.roleOrder === Roles.MAFIA) {
        const mafia: Array<Role> = currentGame.roles.filter((role: Role) => role.name === Roles.MAFIA || role.name === Roles.DON);

        if (mafia.length !== currentGame.voting.length) {
            const playerIndex = mafia.findIndex((role: Role) => role.user.nickname === currentGame.playerOrder);
            return mafia[playerIndex].user.nickname;
        }

        return Roles.NOBODY
    }
        
    
    
    const playerIndex: number = currentGame.players.findIndex((player: Player) => player.nickname === currentGame.roleOrder);
    
    if (playerIndex >= currentGame.players.length - 1) {
        return Roles.NOBODY
    } 

    return currentGame.players[playerIndex + 1].nickname;
}