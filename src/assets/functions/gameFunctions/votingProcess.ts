import { GameDocument } from "../../interfaces/Game";
import { Player } from "../../interfaces/Player";
import { Role } from "../../interfaces/Role";
import { Roles } from "../../enums/Roles";
import { addMessage } from "../dbFunctions/addMessage";
import { publishMessage } from "../publishFunctions/publishMessage";
import { PubSub } from "graphql-subscriptions";
import { voting } from "../helpFunctions/voting";
import { updateGame } from "../dbFunctions/updateGame";
import { GamePhase } from "../../enums/GamePhase";

export async function votingProcess(currentGame:GameDocument,pubsub:PubSub):Promise<GameDocument> {     
     
     if(currentGame.roleOrder === Roles.MAFIA && currentGame.voting.length !== currentGame.roles.filter((role:Role)=>role.name === Roles.MAFIA).length){
               return currentGame;
     }

     if(currentGame.voting.length !== currentGame.roles.length){
               return currentGame     
     }

     const winner:Player|null=voting(currentGame.voting);

     if(winner){
          currentGame.voting = currentGame.voting.filter((player:Player)=>player.playerId !== winner.playerId);

          if(currentGame.roleOrder === Roles.MAFIA){
               const mafia:Array<Role> = currentGame.roles.filter((role:Role)=>role.name === Roles.MAFIA);

               if(mafia[0].alibi){
                    currentGame = await addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.MAFIA,`You are blocked, your lover chose you`,GamePhase.NIGHT,false);
               }
               currentGame = await addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.MAFIA,`At the end of the vote,${winner.nickname} will be the victim`,GamePhase.NIGHT,false);
               await publishMessage(currentGame,pubsub)
          }
          else{
               currentGame = await addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`At the end of the vote,${winner.nickname} is out`,GamePhase.VOTING,false);
               await publishMessage(currentGame,pubsub)     
          }
     }
     else{
          if(currentGame.roleOrder === Roles.MAFIA){
                    currentGame = await addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.MAFIA,`There was no victim on the ballot,please vote again`);
                    await publishMessage(currentGame,pubsub)
          }
          else{
               currentGame = await addMessage(currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`There was no winner on the ballot,please vote again`);
               await publishMessage(currentGame,pubsub)
               
          }
     }
     currentGame.voting = [];

     return await updateGame(currentGame);
}