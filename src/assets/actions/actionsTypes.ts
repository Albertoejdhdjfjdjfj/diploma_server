import { Player } from "../schemas/Player"
import { Role } from "../schemas/Role"
export type InitGame={ initGame: { players: Array<Player> } }
export type RoleAssigned= { roleAssigned: { playerId:String, role: Role} }