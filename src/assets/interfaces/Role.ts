import { Document } from "mongoose";
import { Player } from "./Player";

export interface Role{
     user: Player;
     role: string;
     alive: boolean;
     alibi:boolean;
     active:boolean;
 };

 export interface RoleDocument extends Role, Document{

 }