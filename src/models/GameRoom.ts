import { Schema, model,Model, Document } from "mongoose";
import { User } from "./User";

export interface GameRoom {
     name: string;
     creator: {
         creatorId: string;
         nickname: string;
     };
     players: Array<{
         playerId: string; 
         nickname: string;
     }>;
 }
 
 export interface GameRoomDocument extends GameRoom,Document {}

 const GameRoomSchema: Schema<GameRoomDocument> = new Schema<GameRoomDocument>({
     name: { type: String, required: true, unique: true },
     creator: {
         creatorId: { type: String, required: true }, 
         nickname: { type: String, required: true }
     },
     players: [{
         playerId: { type: String, required: true },
         nickname: { type: String, required: true }
     }]
 });
export const GameRoomModel: Model<GameRoomDocument> = model ("Game Room", GameRoomSchema);