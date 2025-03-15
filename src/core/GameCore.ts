import { Role } from "../assets/schemas/Role";
import { Player } from "../assets/schemas/Player";
import { roles } from "../assets/variables/variables";
 
function distributeRoles(players: Player[]): Role[] {
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


 const players = [
     { nickname: "Player1", playerId: "1" },
     { nickname: "Player2", playerId: "2" },
     { nickname: "Player3", playerId: "3" },
     { nickname: "Player4", playerId: "4" },
     { nickname: "Player5", playerId: "5" },
     { nickname: "Player6", playerId: "6" },
     { nickname: "Player7", playerId: "7" },
     { nickname: "Player8", playerId: "8" },
     { nickname: "Player9", playerId: "9" },
     { nickname: "Player10", playerId: "10" },
 ];
 
 const rolesDistribution = distributeRoles(players);
 console.log(rolesDistribution);