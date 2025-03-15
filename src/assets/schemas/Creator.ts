import { Schema ,Document} from "mongoose";


export interface Creator{
     nickname: string;
     creatorId: string;
}

export interface CreatorDocument extends Creator,Document{

}

export const CreatorSchema: Schema<CreatorDocument> = new Schema<CreatorDocument>({
     nickname: { type: String, required: true }, 
     creatorId: { type: String, required: true }, 
 });

   