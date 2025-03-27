import { Document } from "mongoose";

export interface Creator{
     nickname: string;
     creatorId: string;
}

export interface CreatorDocument extends Creator,Document{

}