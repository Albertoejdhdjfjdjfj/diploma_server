const userResolver = require('./userResolver')
const gameResolver = require('./gameResolver')

module.exports = {
     Query:{
          ...userResolver.Query,
          ...gameResolver.Query
     },
     Mutation:{
          ...userResolver.Mutation,
          ...gameResolver.Mutation
     }
}
