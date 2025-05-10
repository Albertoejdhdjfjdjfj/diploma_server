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
     phase: {
         type: String,
         default: GamePhase.VOTING    
     },
     roleInLine:{
        type: String,
        default: Roles.NOBODY 
     },
     playerInLine:{
        type: PlayerSchema,
        default: null    
     },
     round: {
         type: Number,
         default: 0               
     },
     chat:[{
        type:MessageSchema,
        default:[]
    }],
     voting:[{
        type: PlayerSchema,      
        default: []   
     }]
 });
