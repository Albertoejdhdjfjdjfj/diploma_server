import { Role } from '../../interfaces/Role';
import { Player } from '../../interfaces/Player';
import { rolesDistribution } from "../../variables/variables";
import { playersMin } from '../../variables/variables';

export function distributeRoles(players: Player[]): Role[] {
     const playersWithRoles: Array<Role> = [];
     
     const availablePlayers = [...players];

     for (let role of rolesDistribution[availablePlayers.length - playersMin]) {
         for (let i = 0; i < role.num; i++) {
             const index = Math.floor(Math.random() * availablePlayers.length);
             const player: Player = availablePlayers[index];
 
             playersWithRoles.push({ 
                 user: player,
                 name: role.name,
                 alive: true,
                 alibi: 0,
                 active:true,
                 treated:0,
             });
 
             availablePlayers.splice(index, 1);
         }
     }
 
     return playersWithRoles;
 }
 