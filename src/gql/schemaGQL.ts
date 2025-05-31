const {gql} = require('apollo-server-express')

export const schemaGQL = gql`
    type Query {
        getProfileData:UserInfo
        userLogIn(email: String!, password: String!): LoginPayload
        getGameRooms(sort: String!, page: Int!, limit: Int!): [GameRoom!]!
        getMessages(gameId:String!):[Message]
        getPlayers(gameId:String!):GameMembers!
        getActiveGame:ActiveGameResponse!
    } 
 
    type Mutation {
        userSignUp( nickname: String!,email: String!,password: String!): User
        createGameRoom(name: String!): GameRoom
        joinGameRoom(id:ID!):GameRoom
        leaveGameRoom(id:ID!):GameRoom
        startGame(id:ID!):String
        sendMessage(content:String!,gameId:String!):String
    }
 
    type Subscription{
        newMessage(token:String,gameId:String!): Message
        updatedGameRoom: GameRoom
        activeGame(token:String):ActiveGameResponse
    }
    
    type ActiveGameResponse {
        gameId:String
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
        id:ID,
        sender: Player,
        content:String
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