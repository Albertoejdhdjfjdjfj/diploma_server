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
         required: true,
         default:[]
     }],
     observers: [{
         type: PlayerSchema,    
         default: []               
     }],
     isActive: {
         type: Boolean,
         required: true,
         default: true            
     },
     phase: {
         type: String,
         required: true,
         default: GamePhase.DAY    
     },
     role:{
        type: String,
        required: true,
        default: ""    
     },
     player:{
        type: String,
        required: true,
        default: ""    
     },
     round: {
         type: Number,
         required: true,
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
