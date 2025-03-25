import { Schema, model, Model, Document } from "mongoose";
import { PlayerSchema, Player } from "../schemas/Player";
import { CreatorSchema, Creator } from "../schemas/Creator";

export interface GameRoom {
    name: string;
    creator: Creator;  
    players: Array<Player>;
    observers: Array<Player>;
}

export interface GameRoomDocument extends GameRoom, Document {}

const GameRoomSchema: Schema<GameRoomDocument> = new Schema<GameRoomDocument>({
    name: { type: String, required: true, unique: true },
    creator: { type: CreatorSchema, required: true },
    players: [{ type: PlayerSchema, required: true }],
    observers: [{ type: PlayerSchema }],
});

export const GameRoomModel: Model<GameRoomDocument> = model<GameRoomDocument>("GameRoom", GameRoomSchema);

