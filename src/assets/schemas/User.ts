import { Schema } from "mongoose";
import { UserDocument } from "../interfaces/User";

export const UserSchema: Schema<UserDocument> = new Schema<UserDocument>({
     nickname: { type: String, required: true,unique: true },
     email: { type: String, required: true ,unique: true,},
     password: { minlength:6,type: String, required: true ,unique: true },
   });
   