import { UserDocument } from '../../assets/interfaces/User';
import { UserModel} from '../../assets/models/User';

const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

require('dotenv').config();
const ACCESS_SECRET = process.env.ACCESS_SECRET;

const userResolver = {
    Query: {
        getUserInfo:async (_: any, args:any) => {
            const{id}=args;
            const user:UserDocument|null=await UserModel.findById(id as string);
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
              const token = jwt.sign({
                id: user.id,
                email,
                nickname: user.nickname
              },ACCESS_SECRET);

              return {user,token}
            } catch (error) { 
                throw new Error((error as Error).message); 
            } 
          },
    },
    Mutation: {
     userSignUp: async (_: any, { input }: {input:UserDocument}) => {
          try {
            
            if(!validator.isEmail(input.email)){
                throw new Error('Invalid email');
            }

            const existingUser = await UserModel.findOne({
                $or: [{ nickname: input.nickname }, { email: input.email }]
            });

            if (existingUser) {
                throw new Error('Nickname or email already in use');
            }
            const hashedPassword = await bcrypt.hash(input.password, 10);
            const newUser = new UserModel({ ...input, password: hashedPassword });
            const savedUser = await newUser.save();
            return savedUser; 
          } catch (error) { 
              throw new Error((error as Error).message); 
          } 
      },
    }, 
};

module.exports = userResolver;