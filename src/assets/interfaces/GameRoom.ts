import { Document } from "mongoose";
import { Player } from "../interfaces/Player"
import {Creator} from '../interfaces/Creator'

export interface GameRoom {
    name: string;
    creator: Creator;  
    players: Array<Player>;
    observers: Array<Player>;
}

export interface GameRoomDocument extends GameRoom, Document {}