import { Schema} from "mongoose";
import { RoleDocument } from "../interfaces/Role";
import { PlayerSchema } from "./Player";


 export const RoleSchema:Schema<RoleDocument> = new Schema<RoleDocument>({
    player: { type: PlayerSchema, required: true }, 
    name: { type: String, required: true }, 
    alive: { type: Boolean, required: true, default: true}, 
    alibi: { type: Number, required: true, default: 0}, 
    active: { type: Boolean, required: true, default: true},
    treated:{ type: Number, required: true, default: 0}
 })