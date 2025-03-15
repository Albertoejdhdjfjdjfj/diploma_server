import { Schema ,Document} from "mongoose";


export interface Player{
     nickname: string;
     playerId: string;
}

export interface PlayerDocument extends Player,Document{

}

export const PlayerSchema: Schema<PlayerDocument> = new Schema<PlayerDocument>({
     nickname: { type: String, required: true }, 
     playerId: { type: String, required: true }, 
 });

   