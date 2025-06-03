import { Player } from "../interfaces/Player";
import OpenAI from "openai";
import dotenv from 'dotenv'
import { promtGenerator } from "./promtGenerator";
import { Game } from "../interfaces/Game";

dotenv.config();
const baseURL = process.env.BASEURL;
const apiKey = process.env.APIKEY;

export async function AIMessage(role:string,sender:Player,currentGame:Game):Promise<string>{
     const openai = new OpenAI({
        baseURL,
        apiKey,
     });

     const completion = await openai.chat.completions.create({
          model: "deepseek/deepseek-r1",
          messages: [
               {
                    role: 'user',
                    content: promtGenerator(role,sender,currentGame),
               },
          ],
     });

     return completion.choices[0].message?.content||'';
}