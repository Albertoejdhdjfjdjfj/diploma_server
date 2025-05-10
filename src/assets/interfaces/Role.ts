import { Document } from "mongoose";
import { Player } from "./Player";

export interface Role{
     player: Player;
     name: string;
     alive: boolean;
     alibi:number;
     active:boolean;
     treated:number;
 };

 export interface RoleDocument extends Role, Document{

 }