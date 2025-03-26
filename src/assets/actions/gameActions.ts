import { Message } from "../schemas/Message";
import { Player } from "../schemas/Player";
export type NewMessage = {message:{receiver:Player,chat:Array<Message>}}
export type AssignRole = {role:{receiver:Player,role:String}}