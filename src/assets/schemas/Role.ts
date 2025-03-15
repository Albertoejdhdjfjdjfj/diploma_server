import { Schema,Document } from "mongoose";
import { Player,PlayerSchema } from "./Player";

export interface Role{
     user: Player;
     role: string;
     alive: boolean;
     alibi:boolean;
     active:boolean;
 };

 export interface RoleDocument extends Role, Document{

 }

 export const RoleSchema:Schema<RoleDocument> = new Schema<RoleDocument>({
    user: { type: PlayerSchema, required: true }, 
    role: { type: String, required: true }, 
    alive: { type: Boolean, required: true }, 
    alibi: { type: Boolean, required: true }, 
    active: { type: Boolean, required: true }
 })