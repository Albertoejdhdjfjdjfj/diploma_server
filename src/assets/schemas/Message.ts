import { Schema} from "mongoose";
import { MessageDocument } from "../interfaces/Message";
import { RoleSchema } from "./Role";
import { GamePhase } from "../enums/GamePhase";

export const MessageSchema: Schema<MessageDocument> = new Schema<MessageDocument>({
    sender: { type: RoleSchema, required: true },
    receiver:{type: String,required:true},
    content: { type: String, required: true },
    moment:{type: String, enum: Object.values(GamePhase),required: true,default: GamePhase.DAY},
});


