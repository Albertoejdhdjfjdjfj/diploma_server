import { Document } from "mongoose";
import { Role } from "./Role";

export interface Message {
     sender:Role,
     receiver:String
     content:string,
     moment:String,
 }
 
 export interface MessageDocument extends Message, Document {}