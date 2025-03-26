import { Message } from "graphql-ws";
import { GamePhase } from "../models/Game";

export function filterMessages(chat:Array<Message>,role:String,phase:String):Array<Message>{
     if(phase == GamePhase.NIGHT){
          
     }
}