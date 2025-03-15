import { Schema, model,Model, Document } from "mongoose";

export interface User extends Document {
  nickname: string;
  email: string;
  password: string;
}

const UserSchema: Schema<User> = new Schema<User>({
  nickname: { type: String, required: true,unique: true },
  email: { type: String, required: true ,unique: true,},
  password: { minlength:6,type: String, required: true ,unique: true },
});

export const UserModel: Model<User> = model ("User", UserSchema);
