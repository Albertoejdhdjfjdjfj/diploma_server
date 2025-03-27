import { ASSIGNING_ROLE } from "../actions/actionsList";
import { PubSub } from "graphql-subscriptions";
import { Role } from "../interfaces/Role";

export async function publishRoles(roles:Array<Role> ,pubsub:PubSub):Promise<void>{
     for(let role of roles){
          await pubsub.publish(ASSIGNING_ROLE, {role:{receiverId:role.user.playerId,role:role.role}});
     }
}