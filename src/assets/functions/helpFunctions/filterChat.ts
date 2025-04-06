import { Message } from '../../interfaces/Message'
import { GamePhase } from "../../enums/GamePhase";
import { Roles } from "../../enums/Roles";

export function filterChat(chat:Array<Message>,senderRole:String):Array<Message>{
     switch(senderRole){
          case Roles.LOVER: return chat.filter((message:Message)=> message.phase===GamePhase.VOTING || message.receiverRole === Roles.ALL)
          case Roles.MAFIA: return chat.filter((message:Message)=> message.phase===GamePhase.VOTING || message.receiverRole === Roles.ALL || message.receiverRole === Roles.MAFIA)
          case Roles.DON: return chat.filter((message:Message)=> message.phase===GamePhase.VOTING || message.receiverRole === Roles.ALL || message.receiverRole === Roles.MAFIA || message.receiverRole === Roles.DON)
          case Roles.SHERIFF: return chat.filter((message:Message)=> message.phase===GamePhase.VOTING || message.receiverRole === Roles.ALL || message.receiverRole === Roles.SHERIFF)
          case Roles.DOCTOR: return chat.filter((message:Message)=> message.phase===GamePhase.VOTING || message.receiverRole === Roles.ALL)
          case Roles.MANIAC: return chat.filter((message:Message)=> message.phase===GamePhase.VOTING || message.receiverRole === Roles.ALL)         
     }

     return chat.filter((message:Message)=>message.phase !== GamePhase.NIGHT)
}