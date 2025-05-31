const userResolver = require('./userResolver')
const gameRoomResolver = require('./gameRoomResolver')
const gameResolver = require('./gameResolver')

export const combineResolver = {
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
          ...gameResolver.Subscription,
          ...gameRoomResolver.Subscription
     }
}
