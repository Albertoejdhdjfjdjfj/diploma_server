import { GamePhase } from "../../enums/GamePhase";
import { Roles } from "../../enums/Roles";
import { Role } from "../../interfaces/Role";

export function targetValidator(playerRole:Role,targetRole:Role,phase:string):boolean{
     switch(playerRole.name){
          case Roles.LOVER:{
               if((targetRole.name !== Roles.NOBODY)){
                    if(phase===GamePhase.NIGHT&&targetRole.name!==Roles.LOVER){
                         return true
                    }
                    if(targetRole.user.playerId!==playerRole.user.playerId){
                         return true
                    }
               }

               return false
          }
          case Roles.MAFIA:{
               if(targetRole.name !== Roles.NOBODY){
                    if(phase===GamePhase.NIGHT&&targetRole.name!==Roles.MAFIA&&targetRole.name!==Roles.DON){
                         return true
                    }
                    if(targetRole.user.playerId!==playerRole.user.playerId){
                         return true
                    }
               }

               return false
          }
          case Roles.DON:{
               if(targetRole.name !== Roles.NOBODY){
                    if(phase===GamePhase.NIGHT&&targetRole.name!==Roles.MAFIA&&targetRole.name!==Roles.DON){
                         return true
                    }
                    if(targetRole.user.playerId!==playerRole.user.playerId){
                         return true
                    }
               }

               return false
          }
          case Roles.SHERIFF: {
               if(targetRole.name !== Roles.NOBODY){
                    if(phase===GamePhase.NIGHT&&targetRole.name!==Roles.SHERIFF){
                         return true
                    }
                    if(targetRole.user.playerId!==playerRole.user.playerId){
                         return true
                    }
               }

               return false
          }
          case Roles.DOCTOR: {
               if(targetRole.name !== Roles.NOBODY){
                    return true
               }

               return false
          }
          case Roles.MANIAC: {
               if(targetRole.user.playerId!==playerRole.user.playerId){
                    return true
               }

               return false
          }
     }
     return false;
}