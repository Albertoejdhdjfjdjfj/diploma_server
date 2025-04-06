import { GamePhase } from "../../enums/GamePhase";
import { Roles } from "../../enums/Roles";

export function determinateReceiver(role:string,phase:string,order:string):string{
     switch(role){
          case Roles.LOVER: return phase === GamePhase.VOTING? Roles.ALL:Roles.NOBODY
          case Roles.MAFIA: return phase === GamePhase.VOTING? Roles.ALL:Roles.MAFIA
          case Roles.DON: return phase ===  GamePhase.VOTING? Roles.ALL:order === Roles.MAFIA? Roles.MAFIA:Roles.NOBODY
          case Roles.SHERIFF: return GamePhase.VOTING? Roles.ALL:Roles.NOBODY
          case Roles.DOCTOR: return GamePhase.VOTING? Roles.ALL:Roles.NOBODY
          case Roles.MANIAC: return GamePhase.VOTING? Roles.ALL:Roles.NOBODY         
     }

     return Roles.NOBODY
}