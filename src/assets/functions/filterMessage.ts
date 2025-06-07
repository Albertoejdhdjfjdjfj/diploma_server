import { Message } from '../interfaces/Message'
import { GamePhase } from "../enums/GamePhase";
import { Roles } from "../enums/Roles";

export function filterMessage(message:Message,receiverRole:String):Message|null{
     switch(receiverRole){
          case Roles.LOVER:{
               if(message.receiverRole===Roles.LOVER){
                    return message;
               }

               if(message.receiverRole===Roles.ALL){
                         return message
               }

               return null;
          },
          case Roles.MAFIA: {
               if(message.receiverRole===Roles.MAFIA){
                    return message;
               }

               if(message.receiverRole===Roles.ALL){
                         return message
               }

               return null;
          },
          case Roles.DON:{
               if(message.phase===GamePhase.NIGHT){
                    if(message.receiverRole===Roles.MAFIA){
                         return message;
                    }
                    if(message.receiverRole===Roles.DON){
                         return message;
                    }
               }

               if(message.receiverRole===Roles.DON){
                         return message;
               }

               if(message.receiverRole===Roles.ALL){
                         return message
               }

               return null;
          }
          case Roles.SHERIFF:{
               if(message.receiverRole===Roles.SHERIFF){
                         return message;
               }

               if(message.receiverRole===Roles.ALL){
                         return message
               }

               return null;
          }
          case Roles.DOCTOR:{
               if(message.receiverRole===Roles.DOCTOR){
                    return message;
               }

               if(message.receiverRole===Roles.ALL){
                         return message
               }

               return null;
          }
          case Roles.MANIAC:{
               if(message.receiverRole===Roles.MANIAC){
                    return message;
               }

               if(message.receiverRole===Roles.ALL){
                         return message
               }

               return null;
          } 
          case Roles.CIVILIAN:{
               if(message.receiverRole===Roles.CIVILIAN){
                         return message;
               }

               if(message.receiverRole===Roles.ALL){
                         return message
               }

               return null;
          }
     }

     return message
}
