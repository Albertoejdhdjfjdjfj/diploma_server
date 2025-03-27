import { Message } from '../interfaces/Message'
import { GamePhase } from "../enums/GamePhase";
import { Roles } from "../enums/Roles";

export function filterChat(chat:Array<Message>,role:String):Array<Message>{
     switch(role){
          case Roles.LOVER: return chat.filter((message:Message)=> message.moment===GamePhase.VOTING || message.receiver === Roles.ALL)
          case Roles.MAFIA: return chat.filter((message:Message)=> message.moment===GamePhase.VOTING || message.receiver === Roles.ALL || message.receiver === Roles.MAFIA)
          case Roles.DON: return chat.filter((message:Message)=> message.moment===GamePhase.VOTING || message.receiver === Roles.ALL || message.receiver === Roles.MAFIA || message.receiver === Roles.DON)
          case Roles.SHERIFF: return chat.filter((message:Message)=> message.moment===GamePhase.VOTING || message.receiver === Roles.ALL || message.receiver === Roles.SHERIFF)
          case Roles.DOCTOR: return chat.filter((message:Message)=> message.moment===GamePhase.VOTING || message.receiver === Roles.ALL)
          case Roles.MANIAC: return chat.filter((message:Message)=> message.moment===GamePhase.VOTING || message.receiver === Roles.ALL)         
     }

     return chat.filter((message:Message)=>message.moment !== GamePhase.NIGHT)
}