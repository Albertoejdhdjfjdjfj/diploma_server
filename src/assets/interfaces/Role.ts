import { Document } from "mongoose";
import { Player } from "./Player";

export interface Role{
     user: Player;
     name: string;
     alive: boolean;
     alibi:boolean;
     active:boolean;
     treated:boolean;
 };

 export interface RoleDocument extends Role, Document{

 }