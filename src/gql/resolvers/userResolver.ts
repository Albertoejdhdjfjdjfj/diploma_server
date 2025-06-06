import { Player } from '../../assets/interfaces/Player';
import { UserDocument } from '../../assets/interfaces/User';
import { UserModel} from '../../assets/models/User';

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

require('dotenv').config();
const ACCESS_SECRET = process.env.ACCESS_SECRET;

const userResolver = {
    Query: {
        getProfileData:async (_: any, args:any,userData:Player) => {
          const user:UserDocument|null=await UserModel.findById(userData.playerId as string);
          if(!user){
            throw new Error('User does not exist')
          }
           
          return user
        },
        userLogIn: async (_: any, args:any) => {
            try {
              const {email,password} = args;

              const user: UserDocument | null = await UserModel.findOne({ email });
              if (!user) {
                    throw new Error('Profile does not exist');
              }
              
              const validPassword: boolean = bcrypt.compareSync(password, user.password);
              if (!validPassword) {
                   throw new Error('Incorrect password');
              }
              const token:string = jwt.sign({
                userId: user.id,
                email,
                nickname: user.nickname
              },ACCESS_SECRET);

              return {user,token:"Bearer " + token}
            } catch (error) { 
                throw new Error((error as Error).message); 
            } 
          },
    },
    Mutation: {
     userSignUp: async (_: any, args:any) => {
          try {
            const {nickname,email,password}=args;
            
            // if(!validator.isEmail(input.email)){
            //     throw new Error('Invalid email');
            // }

            const existingUser = await UserModel.findOne({
                $or: [{ nickname: nickname }, { email: email }]
            });

            if (existingUser) {
                throw new Error('Nickname or email already in use');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({ ...args, password: hashedPassword });
            const savedUser = await newUser.save();
            return savedUser; 
          } catch (error) { 
              throw new Error((error as Error).message); 
          } 
      },
    }, 
};

module.exports = userResolver;