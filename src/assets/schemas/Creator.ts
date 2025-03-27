import { Schema } from "mongoose";
import { CreatorDocument } from "../interfaces/Creator";


export const CreatorSchema: Schema<CreatorDocument> = new Schema<CreatorDocument>({
     nickname: { type: String, required: true }, 
     creatorId: { type: String, required: true }, 
 });

   