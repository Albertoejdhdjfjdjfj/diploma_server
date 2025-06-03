import { Role } from "../interfaces/Role";
import { DBController } from "../classes/dbController";
import { GameAlgorithms } from "../classes/GameAlgorithms";
import { GameModel } from "../models/Game";
import { GameDocument } from "../interfaces/Game";
import { PubController } from "../classes/PubController";
import { GameCore } from "../../core/GameCore";
import { Player } from "../interfaces/Player";
import { PubSub } from "graphql-subscriptions";
import { AIMessage } from "./AIMessage";

export async function sendAITimeoutMessage(currentGame:GameDocument, pubsub: PubSub, duration: number = 120000): Promise<void> {
    const gameId = currentGame.id;
    const lastPlayer = currentGame.playerInLine;

    setTimeout(async () => {
        try {
            const currentGame: GameDocument | null = await GameModel.findById(gameId);
            if (!currentGame) {
                throw new Error("Игра не существует");
            }  

            if (currentGame.playerInLine&&(lastPlayer?.playerId===currentGame.playerInLine?.playerId)) {
                const receiver = GameAlgorithms.determineReceiverRole(currentGame.roleInLine, currentGame.phase, currentGame.roleInLine);
                const content = await AIMessage(currentGame.roleInLine,currentGame.playerInLine,currentGame)
                console.log(content);
                const target = GameAlgorithms.getWordStartingWithAt(content);

                if (target) {
                    const targetId: string | undefined = DBController.getPlayerByName(currentGame, target)?.playerId;
                    if (!targetId) {
                        throw new Error("Цель не является игроком в этой игре");
                    }
                    await DBController.addMessage(currentGame, currentGame.playerInLine, receiver, content);
                    await PubController.pubMessage(currentGame, pubsub);
                    new GameCore(currentGame, pubsub).game();
                    return;
                }

                await DBController.addMessage(currentGame, currentGame.playerInLine, receiver, content);
                await PubController.pubMessage(currentGame, pubsub);
            }
        } catch {
          
        }
    }, duration); 
}