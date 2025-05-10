import { Schema} from "mongoose";
import { MessageDocument } from "../interfaces/Message";
import { PlayerSchema } from "./Player";
import { GamePhase } from "../enums/GamePhase";

export const MessageSchema: Schema<MessageDocument> = new Schema<MessageDocument>({
    sender: { type: PlayerSchema, required: true },
    receiverRole:{type: String,required:true},
    content: { type: String, required: true },
    phase: { type: String, required: true },
});


