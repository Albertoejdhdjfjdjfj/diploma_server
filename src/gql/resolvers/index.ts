import { subscribe } from "diagnostics_channel"

const userResolver = require('./userResolver')
const gameRoomResolver = require('./gameRoomResolver')
const gameResolver = require('./gameResolver')
module.exports = {
     Query:{
          ...userResolver.Query,
          ...gameRoomResolver.Query,
          ...gameResolver.Query
     },
     Mutation:{
          ...userResolver.Mutation,
          ...gameRoomResolver.Mutation,
          ...gameResolver.Mutation
     },
     Subscription:{
          ...gameRoomResolver.Subscription,
          ...gameResolver.Subscription
     }
}
