import { Document } from "mongoose";

export interface User  {
     nickname: string;
     email: string;
     password: string;
}

export interface UserDocument extends User,Document{

 }