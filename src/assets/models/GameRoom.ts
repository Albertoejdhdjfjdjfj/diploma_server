import {model, Model} from "mongoose";
import { GameRoomDocument } from "../interfaces/GameRoom";
import { GameRoomSchema } from "../schemas/GameRoom";

export const GameRoomModel: Model<GameRoomDocument> = model<GameRoomDocument>("GameRoom", GameRoomSchema);

