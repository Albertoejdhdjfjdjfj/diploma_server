const {gql} = require('apollo-server-express')

const typeDefs = gql`
    type Query {
        getUserInfo(id:ID!):UserInfo
        userLogIn(email: String!, password: String!): LoginPayload
        getGameRooms(sort: String, page: Int, limit: Int): [GameRoom!]!
    }

    type Mutation {
        userSignUp(input: UserSignUpInput): User
        createGameRoom(name: String!): GameRoom
        joinGameRoom(id:ID!):GameRoom
        leaveGameRoom(id:ID!):GameRoom
        startGame(id:ID!):String
    }

    type Subscription{
        roleAssigned: RoleAssignedPayload
        gameRoomUpdated: GameRoom,
        initGame: String
    }

    type RoleAssignedPayload {
        playerId: String
        role: String
    }

    type GameRoom {
        id: ID!,
        name: String!,
        creator: Creator!,
        players: [Player!]!
    }

    type Creator{
       creatorId: String, 
       nickname: String
    }

    type Player{
       playerId: String, 
       nickname: String
    }

    type User {
        id: ID,
        nickname: String,
        email: String,
    }

     
    type UserInfo {
        id: ID,
        nickname: String,
    }

    type LoginPayload {
        user: User!,
        token: String!
    }

    input UserSignUpInput {
        nickname: String!,
        email: String!,
        password: String!
    }
`;

module.exports = typeDefs;