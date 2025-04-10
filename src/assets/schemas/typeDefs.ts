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
        sendMessage(id:ID!,content:String):String
        sendSelection(id:ID!,targetId:String):String
    }

    type Subscription{
        message(token:String): MessageResponse
        role(token:String): RoleResponse
    }
    
    type RoleResponse {
        receiver:Player,
        role:String
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