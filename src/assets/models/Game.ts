import { Schema, model,Model, Document } from "mongoose";
import { Role,RoleSchema } from "../schemas/Role";
import { Player,PlayerSchema } from "../schemas/Player";

export interface Game{
     players: Array<Player>;
     roles:  Array<Role>;
     observers: Player[];       
     isActive: boolean;         
     currentPhase: GamePhase;   
     rounds: number;            
     winner?: Player[];    
}

export enum GamePhase {
     DAY = "DAY",
     NIGHT = "NIGHT",
     VOTING = "VOTING",
 }

export interface GameDocument extends Game,Document{

}

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
     winner: [{
         type: PlayerSchema,      
         default: []                
     }]
 });

export const GameModel: Model<GameDocument> = model ("Game Room", GameSchema);