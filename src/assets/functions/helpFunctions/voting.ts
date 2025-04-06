import { Player } from "../../interfaces/Player";

export function voting(players:Array<Player>):Player|null {     
     const voteCount: { [key: string]: number } = {};
 
     players.forEach(player => {
         if (player.nickname in voteCount) {
             voteCount[player.nickname]++;
         } else {
             voteCount[player.nickname] = 1;
         }
     });
 
     
     let winner: Player | null = null;
     let maxVotes = 0;
 
     for (const [nickname, votes] of Object.entries(voteCount)) {
         if (votes > maxVotes) {
             maxVotes = votes;
             winner = players.find(player => player.nickname === nickname) || null; 
         }
     }

     return winner
}