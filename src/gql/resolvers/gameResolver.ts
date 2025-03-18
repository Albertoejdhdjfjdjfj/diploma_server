import { GameModel,GameDocument } from '../../assets/models/Game';
import { PubSub } from 'graphql-subscriptions';
import {distributeRoles} from '../../core/GameCore'
import { playersLimit } from '../../assets/variables/variables';
import { subscribe } from 'diagnostics_channel';
import { GAME_INITIATED,ROLE_ASSIGNED } from '../../assets/actions/gameActions';
import { InitGame } from '../../assets/actions/actionsTypes';

const pubsub = new PubSub();

const gameResolver = {
    Query: {   
     
    },
    Mutation: {
      
     }, 
     Subscription: {
        initGame: {
            subscribe: () => pubsub.asyncIterableIterator([GAME_INITIATED]),
            resolve: async (payload:InitGame) => {
                const { players } = payload.initGame;

                const roles = distributeRoles(players);
                
                for (let i = 0; i < players.length; i++) {
                    const playerId = players[i].playerId;
                    const role = roles[i];

                    await GameModel.updateOne(
                        { "players.playerId": playerId },
                        { $set: { "players.$.role": role } }
                    );

                    pubsub.publish(ROLE_ASSIGNED, { roleAssigned: { playerId, role } });
                }
                

                return ""; 
            },
        },
        roleAssigned: {
            subscribe: () => pubsub.asyncIterableIterator([ROLE_ASSIGNED]),
        },
    },
};

module.exports = gameResolver;