import { GamePhase } from "../assets/enums/GamePhase";
import { GameDocument } from "../assets/interfaces/Game";
import { Roles } from "../assets/enums/Roles";
import { PubSub } from "graphql-subscriptions";
import { DBController } from "../assets/classes/dbController";
import { PubController } from "../assets/classes/pubController";
import { distributeRoles } from "../assets/functions/gameFunctions/distributeRoles";
import { nextRoleOrder } from "../assets/functions/gameFunctions/nextRoleOrder";
import { nextPlayerOrder } from "../assets/functions/gameFunctions/nextPlayerOrder";
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
        if(this.currentGame.phase === GamePhase.DAY && !this.currentGame.roleOrder && !this.currentGame.playerOrder){
            await this.dayPhase();
        }
        if(this.currentGame.phase === GamePhase.VOTING && !this.currentGame.roleOrder && !this.currentGame.playerOrder){
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
            this.currentGame.roleOrder === Roles.NOBODY &&
            this.currentGame.playerOrder === Roles.NOBODY 
        )
        {
            this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`The city is falling asleep`,GamePhase.NIGHT,false);
            await PubController.pubMessage(this.currentGame,this.pubsub) 
        }

        const lastRole:string = this.currentGame.roleOrder;
        const nextRole:string = nextRoleOrder(this.currentGame);

        if(nextRole === Roles.NOBODY){
            this.currentGame=await DBController.setPhase(this.currentGame,GamePhase.NIGHT);
            this.currentGame = await DBController.setRoleOrder(this.currentGame,nextRole);
            this.currentGame = await DBController.setPlayerOrder(this.currentGame,Roles.NOBODY);
        }

        const nextPlayer:string = nextPlayerOrder(this.currentGame);

        if(nextPlayer===Roles.NOBODY){
            this.currentGame = await DBController.cleanVoting(this.currentGame);
        }

        this.currentGame = await DBController.setPlayerOrder(this.currentGame,nextPlayer);

        if(lastRole!==nextRole){  
            switch(this.currentGame.roleOrder){
                case Roles.LOVER: {this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,"The lover is waking up",GamePhase.NIGHT,false);break;}
                case Roles.MAFIA: {this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,"The mafia is waking up",GamePhase.NIGHT,false);break;}
                case Roles.DON: {this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,"The don is waking up",GamePhase.NIGHT,false);break;}
                case Roles.SHERIFF: {this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,"The sheriff is waking up",GamePhase.NIGHT,false);break;}
                case Roles.DOCTOR: {this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,"The doctor is waking up",GamePhase.NIGHT,false);break;}
                case Roles.MANIAC: {this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,"The maniak is waking up",GamePhase.NIGHT,false);break;}
            }
            await PubController.pubMessage(this.currentGame,this.pubsub) 
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
        const nextPlayer:string = nextPlayerOrder(this.currentGame);

        this.currentGame = await DBController.setPlayerOrder(this.currentGame,nextPlayer);

        if(nextPlayer === Roles.NOBODY){
            this.currentGame=await DBController.setPhase(this.currentGame,GamePhase.NIGHT); 
            await this.startNewRound()           
        }else{
            this.currentGame = await DBController.addMessage(this.currentGame,{nickname:Roles.ADMIN,playerId:Roles.ADMIN},Roles.ALL,`${nextPlayer} votes`,GamePhase.NIGHT,false)
        }
               
        await PubController.pubMessage(this.currentGame,this.pubsub) 
    }
}
