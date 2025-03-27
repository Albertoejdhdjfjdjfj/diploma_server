import { Player } from "./Player";
import { Role } from "./Role";
import { Document } from "mongoose";
import { GamePhase } from "../enums/GamePhase";
import { Message } from "graphql-ws";

export interface Game{
     players: Array<Player>;
     roles:  Array<Role>;
     observers: Player[];       
     isActive: boolean;         
     currentPhase: GamePhase;   
     rounds: number;  
     chat:Array<Message>          
     winner?: Player[];    
}

export interface GameDocument extends Game,Document{

}