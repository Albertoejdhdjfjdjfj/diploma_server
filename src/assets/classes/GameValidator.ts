import { GameDocument } from "../interfaces/Game";
import { Player } from "../interfaces/Player";
import { GamePhase } from "../enums/GamePhase";
import { GameModel } from "../models/Game";
import { Role } from "../interfaces/Role";
import { Roles } from "../enums/Roles";
import { PubSub } from "graphql-subscriptions";
import { SelectionController } from "./SelectionController";
import { DBController } from "./dbController";

export class GameValidator{
     constructor(){}

     static validTarget(playerRole:string,targetRole:string,phase:string):boolean{
          switch(playerRole){
               case Roles.LOVER: return (targetRole !== Roles.LOVER)?true:false;
               case Roles.MAFIA: return (targetRole !== Roles.MAFIA && targetRole!==Roles.DON)?true:(phase == GamePhase.VOTING)?true:false;
               case Roles.DON: return (targetRole !== Roles.MAFIA && targetRole!==Roles.DON)?true:(phase == GamePhase.VOTING)?true:false;
               case Roles.SHERIFF: return (targetRole !== Roles.SHERIFF)?true:false;
               case Roles.DOCTOR: return true;
               case Roles.MANIAC: return (targetRole !== Roles.MANIAC)?true:false;
          }
          return false;
     }
}