import { GamePhase } from "../assets/enums/GamePhase";
import { GameDocument } from "../assets/interfaces/Game";
import { Roles } from "../assets/enums/Roles";
import { PubSub } from "graphql-subscriptions";
import { DBController } from "../assets/classes/dbController";
import { PubController } from "../assets/classes/PubController";
import { Role } from "../assets/interfaces/Role";
import { GameAlgorithms } from "../assets/classes/GameAlgorithms";
import { Player } from "../assets/interfaces/Player";
import {roles} from "../assets/variables/variables"
import { sendAITimeoutMessage } from "../assets/functions/sendAITimeoutMessage";

export class GameCore{
    currentGame:GameDocument;
    pubsub:PubSub;

    constructor(currentGame:GameDocument,pubsub:PubSub){
        this.currentGame = currentGame;
        this.pubsub = pubsub;
    }

    async game():Promise<void>{
        if(!this.currentGame.round){
            await this.startNewRound()
        }
        if(this.currentGame.phase === GamePhase.NIGHT){
            await this.nightPhase();
        }
        if(this.currentGame.phase === GamePhase.DAY && !this.currentGame.roleInLine && !this.currentGame.playerInLine){
            await this.dayPhase();
        }
        if(this.currentGame.phase === GamePhase.DISCUSSION && !this.currentGame.roleInLine && !this.currentGame.playerInLine){
            await this.discussionPhase();
        }
        if(this.currentGame.phase === GamePhase.VOTING && !this.currentGame.roleInLine && !this.currentGame.playerInLine){
           await this.votingPhase();
        }     
    }

    private async startNewRound():Promise<void> {
        if(!this.currentGame.round){
            this.currentGame=await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,"Hello everyone, the game has started and you will be assigned the appropriate role",2000)
            await PubController.pubMessage(this.currentGame,this.pubsub);
            
            this.currentGame=await DBController.setRoles(this.currentGame,GameAlgorithms.distributeRoles(this.currentGame.players));
            for(let role of roles){
                this.currentGame=await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},role,`You are ${role}`,2000)
                await PubController.pubMessage(this.currentGame,this.pubsub);
            } 
        }
    
        this.currentGame = await DBController.newRound(this.currentGame);
        this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`Round ${this.currentGame.round}`) 
        this.currentGame = await DBController.setPhase(this.currentGame,GamePhase.NIGHT);
        await PubController.pubMessage(this.currentGame,this.pubsub) 
    }

    private async nightPhase():Promise<void>{
        if(
            this.currentGame.roleInLine === Roles.NOBODY &&
            this.currentGame.playerInLine === null 
        )
        {
            this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`The city is falling asleep`);
            await PubController.pubMessage(this.currentGame,this.pubsub) 
        }
        
        const lastRoleInLine=this.currentGame.roleInLine;
        const nextRoleInLine = GameAlgorithms.nextRoleInLine(this.currentGame);
        this.currentGame = await DBController.setRoleInLine(this.currentGame,nextRoleInLine);

        if(lastRoleInLine!==this.currentGame.roleInLine){    
            this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`The ${this.currentGame.roleInLine} is waking up`);
            await PubController.pubMessage(this.currentGame,this.pubsub) 
        }

        if(!this.currentGame.roleInLine){    
                this.currentGame=await DBController.setPhase(this.currentGame,GamePhase.DAY);
                this.currentGame = await DBController.cleanVoting(this.currentGame);
        }
        else{
            const nextPlayerInLine:Player|null = GameAlgorithms.nextPlayerInLine(this.currentGame);
            this.currentGame = await DBController.setPlayerInLine(this.currentGame,nextPlayerInLine);

            if(this.currentGame.playerInLine && DBController.getPlayerRoleById(this.currentGame,this.currentGame.playerInLine?.playerId)?.alibi === this.currentGame.round){
                this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},this.currentGame.roleInLine,"You are blocked, your lover chose you");
                this.nightPhase()
            }  
            else{
                this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},this.currentGame.roleInLine,`This is ${this.currentGame.playerInLine?.nickname} speaking`);
            }
        }


        if(this.currentGame.roleInLine === Roles.MAFIA){
            const mafia: Array<Role> = this.currentGame.roles.filter((role: Role) => role.name === Roles.MAFIA || role.name === Roles.DON);
            if(this.currentGame.voting.length==mafia.length){
                const winner = GameAlgorithms.voting(this.currentGame.voting);
                if(winner){
                    this.currentGame=await DBController.setKill(this.currentGame,winner.playerId);
                    this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},this.currentGame.roleInLine,`${this.currentGame.playerInLine?.nickname} won the vote`);
                }
                else{
                    this.currentGame = await DBController.cleanVoting(this.currentGame);
                    this.currentGame = await DBController.setPlayerInLine(this.currentGame,null);
                    this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},this.currentGame.roleInLine,`There is no winner of the poll, please vote again`);
                }
            }
        }
    }
 
    private async dayPhase():Promise<void>{
        this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`Everyone wakes up`);
        await PubController.pubMessage(this.currentGame,this.pubsub) 
        
        const killed:Array<Role> = GameAlgorithms.determinateKilled(this.currentGame);
        if(killed.length){
            this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`That night, ${killed.map((role:Role)=>role.player.nickname).join(', ')} were killed`);
        }
        else{
            this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`No one was killed that night`);
        }

        for (const role of killed) {
            this.currentGame = await DBController.deletePlayer(this.currentGame, role.player.playerId);
            this.currentGame = await DBController.addPlayerToObservers(this.currentGame, role.player);
        }

        await this.endingGame();
        this.currentGame=await DBController.setPhase(this.currentGame,GamePhase.VOTING)
    }

    private async discussionPhase():Promise<void>{ 
        if(
            this.currentGame.roleInLine === Roles.NOBODY &&
            this.currentGame.playerInLine === null 
        )
        {
            this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`The day's discussion begins`);
            await PubController.pubMessage(this.currentGame,this.pubsub) 
        }
        const nextPlayerInLine:Player|null= GameAlgorithms.nextPlayer(this.currentGame);

        this.currentGame = await DBController.setPlayerInLine(this.currentGame,nextPlayerInLine);

        if(nextPlayerInLine === null){
            this.currentGame=await DBController.setPhase(this.currentGame,GamePhase.VOTING); 
            await this.startNewRound()           
        }else{
            this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`${nextPlayerInLine}'s speaking`)
        }
               
        await PubController.pubMessage(this.currentGame,this.pubsub) 
    }

    private async votingPhase():Promise<void>{ 
        if(
            this.currentGame.roleInLine === Roles.NOBODY &&
            this.currentGame.playerInLine === null 
        )
        {
            this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`Voting begins`);
            await PubController.pubMessage(this.currentGame,this.pubsub) 
        }

        const nextPlayerInLine:Player|null= GameAlgorithms.nextPlayer(this.currentGame);

        this.currentGame = await DBController.setPlayerInLine(this.currentGame,nextPlayerInLine);

        if(nextPlayerInLine === null){
            this.currentGame=await DBController.setPhase(this.currentGame,GamePhase.NIGHT); 
            const winner = GameAlgorithms.voting(this.currentGame.voting);
            if(winner){
                const winnerRole = DBController.getPlayerRoleById(this.currentGame,winner.playerId)
                if(!winnerRole?.alibi){
                    this.currentGame = await DBController.deletePlayer(this.currentGame, winner.playerId);
                    this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`${winner.nickname} won the vote. He is leaving the game`);
                    await PubController.pubMessage(this.currentGame,this.pubsub) 
                    this.currentGame = await DBController.addPlayerToObservers(this.currentGame, winner);
                    await this.endingGame();
                    await this.startNewRound(); 
                }
                else{
                    this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`Today mistress visited him ${winner.nickname}. He continues the game`);
                    await PubController.pubMessage(this.currentGame,this.pubsub) 
                }    
            }   
            else{
                this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`There is no winner of the poll, please vote again`)
                await PubController.pubMessage(this.currentGame,this.pubsub) 
            } 
        }else{
            this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`${nextPlayerInLine} votes`);
            await PubController.pubMessage(this.currentGame,this.pubsub) 
        }
    } 

    private async endingGame():Promise<void>{ 
        const mafia: Array<Role> = this.currentGame.roles.filter((role: Role) => role.name === Roles.MAFIA || role.name === Roles.DON);
        if(mafia.length>=this.currentGame.roles.length-mafia.length){
            this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`The mafia won`)
            await PubController.pubMessage(this.currentGame,this.pubsub) 
            await DBController.deleteGame(this.currentGame,60000);
        }
        if(mafia.length === 0){
            this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`Citizens won`)
            await PubController.pubMessage(this.currentGame,this.pubsub) 
            await DBController.deleteGame(this.currentGame,10000);
        }
    }
}
