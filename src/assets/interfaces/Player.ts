import { Document } from "mongoose";

export interface Player{
     nickname: string;
     playerId: string;
}

export interface PlayerDocument extends Player,Document{

}
