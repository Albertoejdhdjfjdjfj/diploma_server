import { Roles } from "../enums/Roles";
export interface RoleConfig{name:string;num:number}

export const playersMax:number = 15;
export const playersMin:number = 9;

export const rolesDistribution: Array<Array<RoleConfig>> = [
     // Для 9 игроков
     [
         {
             name: Roles.CIVILIAN,
             num: 4
         },
         {
             name: Roles.LOVER,
             num: 1
         },
         {
             name: Roles.SHERIFF,
             num: 1
         },
         {
             name: Roles.MAFIA,
             num: 1
         },
         {
             name: Roles.DON,
             num: 1
         },
         {
             name: Roles.MANIAC,
             num: 1
         },
     ],
      
     // Для 10 игроков
     [
         {
             name: Roles.CIVILIAN,
             num: 5
         },
         {
             name: Roles.LOVER,
             num: 1
         },
         {
             name: Roles.SHERIFF,
             num: 1
         },
         {
             name: Roles.MAFIA,
             num: 1
         },
         {
             name: Roles.DON,
             num: 1
         },
         {
             name: Roles.MANIAC,
             num: 1
         },
     ],
  
     // Для 11 игроков
     [
         {
             name: Roles.CIVILIAN,
             num: 5
         },
         {
             name: Roles.LOVER,
             num: 1
         },
         {
             name: Roles.SHERIFF,
             num: 1
         },
         {
             name: Roles.MAFIA,
             num: 2
         },
         {
             name: Roles.DON,
             num: 1
         },
         {
             name: Roles.MANIAC,
             num: 1
         },
     ],
  
     // Для 12 игроков
     [
         {
             name: Roles.CIVILIAN,
             num: 6
         },
         {
             name: Roles.LOVER,
             num: 1
         },
         {
             name: Roles.SHERIFF,
             num: 1
         },
         {
             name: Roles.MAFIA,
             num: 2
         },
         {
             name: Roles.DON,
             num: 1
         },
         {
             name: Roles.MANIAC,
             num: 1
         },
     ],
  
     // Для 13 игроков
     [
         {
             name: Roles.CIVILIAN,
             num: 5
         },
         {
             name: Roles.LOVER,
             num: 1
         },
         {
             name: Roles.SHERIFF,
             num: 1
         },
         {
             name: Roles.MAFIA,
             num: 3
         },
         {
             name: Roles.DON,
             num: 1
         },
         {
             name: Roles.MANIAC,
             num: 1
         },
         {
             name: Roles.DOCTOR,
             num: 1
         },
     ],
  
     // Для 14 игроков
     [
         {
             name: Roles.CIVILIAN,
             num: 6
         },
         {
             name: Roles.LOVER,
             num: 1
         },
         {
             name: Roles.SHERIFF,
             num: 1
         },
         {
             name: Roles.MAFIA,
             num: 3
         },
         {
             name: Roles.DON,
             num: 1
         },
         {
             name: Roles.MANIAC,
             num: 1
         },
         {
                 name: Roles.DOCTOR,
                 num: 1
         },
     ],
  
     // Для 15 игроков
     [
         {
             name: Roles.CIVILIAN,
             num: 7
         },
         {
             name: Roles.LOVER,
             num: 1
         },
         {
             name: Roles.SHERIFF,
             num: 1
         },
         {
             name: Roles.MAFIA,
             num: 3
         },
         {
             name: Roles.DON,
             num: 1
         },
         {
             name: Roles.MANIAC,
             num: 1
         },
         {
                 name: Roles.DOCTOR,
                 num: 1
         }
     ]
     ]

     export const rolesLine:Array<string> = [ 
        Roles.LOVER,
        Roles.SHERIFF,
        Roles.MAFIA,
        Roles.DON,
        Roles.MANIAC,
        Roles.DOCTOR,         
    ]

     export const roles:Array<string> = [ 
        Roles.LOVER,
        Roles.SHERIFF,
        Roles.MAFIA,
        Roles.DON,
        Roles.MANIAC,
        Roles.DOCTOR,   
        Roles.CIVILIAN,
    ]