import { model,Model } from "mongoose";
import { UserDocument } from "../interfaces/User";
import { UserSchema } from "../schemas/User";

export const UserModel: Model<UserDocument> = model<UserDocument> ("User", UserSchema);
