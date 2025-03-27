import { Message} from '../interfaces/Message'
import { Player } from '../interfaces/Player'

export type NewMessage = {message:{receiver:Player,chat:Array<Message>}}
export type AssignRole = {role:{receiver:Player,role:String}}