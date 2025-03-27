import { Model,model } from "mongoose";
import { GameDocument } from "../interfaces/Game";
import { GameSchema } from "../schemas/Game";

export const GameModel: Model<GameDocument> = model ("Game", GameSchema);