import { Message} from '../interfaces/Message'
import { Player } from '../interfaces/Player'

export type NewMessage = {message:{receiverId:String,chat:Array<Message>}}
export type AssignRole = {role:{receiverId:String,role:String}}