import { Message} from '../interfaces/Message'

export type NewMessage = {newMessage:{receiverId:String,message:Message,gameId:string}} 
export type ActiveGame = {activeGame:{receiverId:String,gameId:string}}
