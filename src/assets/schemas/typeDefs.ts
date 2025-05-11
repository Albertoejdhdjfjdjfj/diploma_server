const {gql} = require('apollo-server-express')

const typeDefs = gql`
    type Query {
        getProfileData:UserInfo
        userLogIn(email: String!, password: String!): LoginPayload
        getGameRooms(sort: String!, page: Int!, limit: Int!): [GameRoom!]!
        getMessages(gameId:String!):[Message!]!
        getPlayers(gameId:String!):GameMembers!
    }

    type Mutation {
        userSignUp( nickname: String!,email: String!,password: String!): User
        createGameRoom(name: String!): GameRoom
        joinGameRoom(id:ID!):GameRoom
        leaveGameRoom(id:ID!):GameRoom
        startGame(gameId:ID!):String
        sendMessage(content:String!):String
        sendSelection(targetId:String!):String
    }

    type Subscription{
        message(token:String): MessageResponse
        role(token:String): RoleResponse
        updatedGameRoom: GameRoom
        members: GameMembers
    }
    
    type RoleResponse {
        receiver:Player,
        role:String
    }

    type GameMembers{
        players:[Player],
        observers:[Player]
    }

    type MessageResponse {
        receiver:Player,
        chat: [Message!]!,
    }   

    type Message {
        sender: Sender,
        content:String
    }

    type Sender{
        user:Player
    }

    type GameRoom {
        id: ID!,
        name: String!,
        creator: Player!,
        players: [Player!]!,
        observers:[Player!]!
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
`;

module.exports = typeDefs;