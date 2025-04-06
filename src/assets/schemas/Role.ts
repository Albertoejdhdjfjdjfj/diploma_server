import { Schema} from "mongoose";
import { RoleDocument } from "../interfaces/Role";
import { PlayerSchema } from "./Player";


 export const RoleSchema:Schema<RoleDocument> = new Schema<RoleDocument>({
    user: { type: PlayerSchema, required: true }, 
    name: { type: String, required: true }, 
    alive: { type: Boolean, required: true, default: true}, 
    alibi: { type: Boolean, required: true, default: false}, 
    active: { type: Boolean, required: true, default: true},
    treated:{ type: Boolean, required: true, default: false },
 })