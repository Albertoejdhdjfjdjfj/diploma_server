import { Message } from '../interfaces/Message'
import { GamePhase } from "../enums/GamePhase";
import { Roles } from "../enums/Roles";

export function filterChat(chat:Array<Message>,receiverRole:String):Array<Message>{
     switch(receiverRole){
          case Roles.LOVER: return chat.filter((message:Message)=>{
               if(message.receiverRole===Roles.LOVER){
                    return true;
               }

               if(message.receiverRole===Roles.ALL){
                         return true
               }

               return false;
          })
          case Roles.MAFIA: return chat.filter((message:Message)=>{
               if(message.receiverRole===Roles.MAFIA){
                    return true;
               }

               if(message.receiverRole===Roles.ALL){
                         return true
               }

               return false;
          })
          case Roles.DON: return chat.filter((message:Message)=>{
               if(message.phase===GamePhase.NIGHT){
                    if(message.receiverRole===Roles.MAFIA){
                         return true;
                    }
                    if(message.receiverRole===Roles.DON){
                         return true;
                    }
               }

               if(message.receiverRole===Roles.DON){
                         return true;
               }

               if(message.receiverRole===Roles.ALL){
                         return true
               }

               return false;
          })
          case Roles.SHERIFF: return chat.filter((message:Message)=>{
               if(message.receiverRole===Roles.SHERIFF){
                         return true;
               }

               if(message.receiverRole===Roles.ALL){
                         return true
               }

               return false;
          })
          case Roles.DOCTOR: return chat.filter((message:Message)=>{
               if(message.receiverRole===Roles.DOCTOR){
                    return true;
               }

               if(message.receiverRole===Roles.ALL){
                         return true
               }

               return false;
          })
          case Roles.MANIAC: return chat.filter((message:Message)=>{
               if(message.receiverRole===Roles.MANIAC){
                    return true;
               }

               if(message.receiverRole===Roles.ALL){
                         return true
               }

               return false;
          }) 
          case Roles.CIVILIAN:return chat.filter((message:Message)=>{
               if(message.receiverRole===Roles.CIVILIAN){
                         return true;
               }

               if(message.receiverRole===Roles.ALL){
                         return true
               }

               return false;
          })  
     }

     return chat 
} 