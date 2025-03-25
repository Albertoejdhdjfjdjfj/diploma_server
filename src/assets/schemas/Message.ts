import { Schema, Document } from "mongoose";
import { PlayerSchema, Player } from "../schemas/Player";

export interface Message {
    player: Player;
    content:string
}

export interface MessageDocument extends Message, Document {}

export const MessageSchema: Schema<MessageDocument> = new Schema<MessageDocument>({
    player: { type: PlayerSchema, required: true },
    content: { type: String, required: true },
});


