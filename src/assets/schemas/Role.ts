import { Schema} from "mongoose";
import { RoleDocument } from "../interfaces/Role";
import { PlayerSchema } from "./Player";


 export const RoleSchema:Schema<RoleDocument> = new Schema<RoleDocument>({
    user: { type: PlayerSchema, required: true }, 
    role: { type: String, required: true }, 
    alive: { type: Boolean, required: true }, 
    alibi: { type: Boolean, required: true }, 
    active: { type: Boolean, required: true }
 })