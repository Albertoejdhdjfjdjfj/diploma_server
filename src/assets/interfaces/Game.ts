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
     isActive: boolean;         
     phase: string; 
     roleOrder:string;  
     playerOrder:string;
     round: number;  
     chat:Array<Message>          
     winner?: Player[];   
     voting:Array<Player>; 
}

export interface GameDocument extends Game,Document{

}