import { Player } from "./Player";
import { Role } from "./Role";
import { Document } from "mongoose";
import { GamePhase } from "../enums/GamePhase";
import { Roles } from "../enums/Roles";
import { Message } from "./Message";

export interface Game{
     players: Array<Player>;
     roles:  Array<Role>;
     observers: Player[];               
     phase: string; 
     roleInLine:string;  
     playerInLine:Player|null;
     round: number;  
     chat:Array<Message>           
     voting:Array<Player>; 
}

export interface GameDocument extends Game,Document{

}