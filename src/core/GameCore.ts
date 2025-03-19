import { Role } from "../assets/schemas/Role";
import { Player } from "../assets/schemas/Player";
import { roles } from "../assets/variables/variables";
 
export function distributeRoles(players: Player[]): Role[] {
     const playersWithRoles: Array<Role> = [];
     
     const availablePlayers = [...players];

     for (let role of roles) {
         for (let i = 0; i < role.num; i++) {
             if (availablePlayers.length === 0) {
                 break; 
             }
             
             const index = Math.floor(Math.random() * availablePlayers.length);
             const player: Player = availablePlayers[index];
 
             playersWithRoles.push({ 
                 user: player,
                 role: role.name,
                 alive: true,
                 alibi: false,
                 active:true,
             });
 
             availablePlayers.splice(index, 1);
         }
     }
 
     return playersWithRoles;
 }