import { Schema } from "mongoose";
import { PlayerDocument } from "../interfaces/Player";


export const PlayerSchema: Schema<PlayerDocument> = new Schema<PlayerDocument>({
     nickname: { type: String, required: true }, 
     playerId: { type: String, required: true }, 
 });

   