import { Schema } from "mongoose";
import { GameRoomDocument } from "../interfaces/GameRoom";
import { CreatorSchema } from "./Creator";
import { PlayerSchema } from "./Player";

export const GameRoomSchema: Schema<GameRoomDocument> = new Schema<GameRoomDocument>({
     name: { type: String, required: true, unique: true },
     creator: { type: CreatorSchema, required: true },
     players: [{ type: PlayerSchema, required: true }],
     observers: [{ type: PlayerSchema }],
 });