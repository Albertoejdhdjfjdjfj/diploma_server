import { Document } from "mongoose";
import { Player } from "./Player";

export interface Message {
     sender: Player,
     receiverRole:string,
     content:string,
     phase:string
 }
 
 export interface MessageDocument extends Message, Document {}