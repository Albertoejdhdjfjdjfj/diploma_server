import { Message } from '../../interfaces/Message'
import { GamePhase } from "../../enums/GamePhase";
import { Roles } from "../../enums/Roles";

export function filterMessage(message:Message,receiverRole:String):Message|null{
     switch(receiverRole){
          case Roles.LOVER: return  message.phase===GamePhase.VOTING || message.receiverRole === Roles.ALL|| message.receiverRole === Roles.LOVER?message:null;
          case Roles.MAFIA: return  message.phase===GamePhase.VOTING || message.receiverRole === Roles.ALL || message.receiverRole === Roles.MAFIA?message:null;
          case Roles.DON: return  message.phase===GamePhase.VOTING || message.receiverRole === Roles.ALL || message.receiverRole === Roles.MAFIA || message.receiverRole === Roles.DON?message:null;
          case Roles.SHERIFF: return  message.phase===GamePhase.VOTING || message.receiverRole === Roles.ALL || message.receiverRole === Roles.SHERIFF?message:null;
          case Roles.DOCTOR: return  message.phase===GamePhase.VOTING || message.receiverRole === Roles.ALL|| message.receiverRole === Roles.DOCTOR?message:null;
          case Roles.MANIAC: return  message.phase===GamePhase.VOTING || message.receiverRole === Roles.ALL|| message.receiverRole === Roles.MANIAC?message:null;        
     }

     return null
}
