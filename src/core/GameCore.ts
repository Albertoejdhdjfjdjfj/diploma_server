import { GamePhase } from "../assets/enums/GamePhase";
import { GameDocument } from "../assets/interfaces/Game";
import { Roles } from "../assets/enums/Roles";
import { PubSub } from "graphql-subscriptions";
import { DBController } from "../assets/classes/dbController";
import { PubController } from "../assets/classes/PubController";
import { distributeRoles } from "../assets/functions/gameFunctions/distributeRoles";
import { nextRole } from "../assets/functions/gameFunctions/nextRole";
import { nextPlayer } from "../assets/functions/gameFunctions/nextPlayer";
import { Role } from "../assets/interfaces/Role";
import { determinateKilled } from "../assets/functions/gameFunctions/determinateKilled";

export class GameCore{
    currentGame:GameDocument;
    pubsub:PubSub;

    constructor(currentGame:GameDocument,pubsub:PubSub){
        this.currentGame = currentGame;
        this.pubsub = pubsub;
    }

    async game():Promise<void>{
        if(!this.currentGame.round){
            this.startNewRound()
        }
        if(this.currentGame.phase === GamePhase.NIGHT){
            await this.nightPhase();
        }
        if(this.currentGame.phase === GamePhase.DAY && !this.currentGame.role && !this.currentGame.player){
            await this.dayPhase();
        }
        if(this.currentGame.phase === GamePhase.VOTING && !this.currentGame.role && !this.currentGame.player){
           await this.votingPhase();
        }
        
    }

    private async startNewRound():Promise<void> {
        if(!this.currentGame.round){
            this.currentGame=await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,"Hello everyone, the game has started and you will be assigned the appropriate role",GamePhase.VOTING,false)
            await PubController.pubMessage(this.currentGame,this.pubsub);
            

            this.currentGame=await DBController.setRoles(this.currentGame,distributeRoles(this.currentGame.players))
            await PubController.pubRoles(this.currentGame,this.pubsub);
        }
    
        this.currentGame = await DBController.newRound(this.currentGame);
        this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`Round ${this.currentGame.round}`,GamePhase.VOTING,false) 
       
        await PubController.pubMessage(this.currentGame,this.pubsub) 
    }

    private async nightPhase():Promise<void>{
        if(
            this.currentGame.role === Roles.NOBODY &&
            this.currentGame.player === Roles.NOBODY 
        )
        {
            this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`The city is falling asleep`,GamePhase.NIGHT,false);
            await PubController.pubMessage(this.currentGame,this.pubsub) 
        }

        const currentRole:string = this.currentGame.role;
        let nextRoleInLine:string = nextRole(this.currentGame);
        
        this.currentGame = await DBController.setRole(this.currentGame,nextRoleInLine)

        if(nextRoleInLine === Roles.NOBODY){
            this.currentGame=await DBController.setPhase(this.currentGame,GamePhase.DAY);
            this.currentGame = await DBController.setPlayer(this.currentGame,Roles.NOBODY);
        }

        const nextPlayerInLine:string = nextPlayer(this.currentGame);

        if(nextPlayerInLine===Roles.NOBODY){
            this.currentGame = await DBController.cleanVoting(this.currentGame);
        }

        this.currentGame = await DBController.setPlayer(this.currentGame,nextPlayerInLine);

        if(currentRole!==nextRoleInLine){    
          this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`The ${nextRoleInLine} is waking up`,GamePhase.NIGHT,false);
          await PubController.pubMessage(this.currentGame,this.pubsub) 
        }
            
        const candiateRole:Role|undefined = this.currentGame.roles.find((role:Role)=>role.name === nextRoleInLine);

        if(candiateRole && (candiateRole.alibi === this.currentGame.round)){
            this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},candiateRole.name,"You are blocked, your lover chose you",GamePhase.NIGHT,false);
            this.nightPhase()
        }        
    }

    private async dayPhase():Promise<void>{
        const killed:Array<Role> = determinateKilled(this.currentGame);

        if(killed.length){
            this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`That night, ${killed.toString()} were killed`,GamePhase.DAY,false);
        }
        else{
            this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`No one was killed that night`,GamePhase.DAY,false);
        }

        for (const role of killed) {
            this.currentGame = await DBController.deletePlayer(this.currentGame, role.user.playerId);
            this.currentGame = await DBController.addPlayerToObservers(this.currentGame, role.user);
        }

        this.currentGame=await DBController.setPhase(this.currentGame,GamePhase.VOTING)
    }

    private async votingPhase():Promise<void>{ 
        const nextPlayerInLine:string = nextPlayer(this.currentGame);

        this.currentGame = await DBController.setPlayer(this.currentGame,nextPlayerInLine);

        if(nextPlayerInLine === Roles.NOBODY){
            
            this.currentGame=await DBController.setPhase(this.currentGame,GamePhase.NIGHT); 
            await this.startNewRound()           
        }else{
            this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`${nextPlayer} votes`,GamePhase.NIGHT,false)
        }
               
        await PubController.pubMessage(this.currentGame,this.pubsub) 
    }
}
