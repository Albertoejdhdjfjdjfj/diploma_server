import { Schema} from "mongoose";
import { RoleSchema } from "../schemas/Role";
import { PlayerSchema } from "../schemas/Player";
import { MessageSchema } from "../schemas/Message";
import {GameDocument} from "../interfaces/Game";
import { GamePhase } from "../enums/GamePhase";
import { Roles } from "../enums/Roles";

export const GameSchema: Schema<GameDocument> = new Schema<GameDocument>({
     players: [{
         type: PlayerSchema,    
         required: true
     }],
     roles: [{
         type: RoleSchema,      
         default:[]
     }],
     observers: [{
         type: PlayerSchema,    
         default: []               
     }],
     isActive: {
         type: Boolean,
         default: true            
     },
     phase: {
         type: String,
         default: GamePhase.VOTING    
     },
     role:{
        type: String,
        default: ""    
     },
     player:{
        type: String,
        default: ""    
     },
     round: {
         type: Number,
         default: 0               
     },
     chat:[{
        type:MessageSchema,
        default:[]
    }],
     winner: [{ 
         type: PlayerSchema,      
         default: []                
     }],
     voting:[{
        type: PlayerSchema,      
        default: []   
     }]
 });
