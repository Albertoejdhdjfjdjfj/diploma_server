import { Document } from "mongoose";
import { Player } from "../interfaces/Player"

export interface GameRoom {
    name: string;
    creator: Player;  
    players: Array<Player>;
    observers: Array<Player>;
}

export interface GameRoomDocument extends GameRoom, Document {}