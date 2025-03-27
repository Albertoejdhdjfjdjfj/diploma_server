import { Schema} from "mongoose";
import { RoleSchema } from "../schemas/Role";
import { PlayerSchema } from "../schemas/Player";
import { MessageSchema } from "../schemas/Message";
import {GameDocument} from "../interfaces/Game";
import { GamePhase } from "../enums/GamePhase";

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
     currentPhase: {
         type: String,
         enum: Object.values(GamePhase),
         required: true,
         default: GamePhase.DAY    
     },
     rounds: {
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
     }]
 });
