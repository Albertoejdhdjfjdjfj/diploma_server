"use strict";
exports.__esModule = true;
exports.roles = exports.rolesLine = exports.rolesDistribution = exports.playersMin = exports.playersMax = void 0;
var Roles_1 = require("../enums/Roles");
exports.playersMax = 15;
exports.playersMin = 9;
exports.rolesDistribution = [
    // Для 9 игроков
    [
        {
            name: Roles_1.Roles.CIVILIAN,
            num: 4
        },
        {
            name: Roles_1.Roles.LOVER,
            num: 1
        },
        {
            name: Roles_1.Roles.SHERIFF,
            num: 1
        },
        {
            name: Roles_1.Roles.MAFIA,
            num: 1
        },
        {
            name: Roles_1.Roles.DON,
            num: 1
        },
        {
            name: Roles_1.Roles.MANIAC,
            num: 1
        },
    ],
    // Для 10 игроков
    [
        {
            name: Roles_1.Roles.CIVILIAN,
            num: 5
        },
        {
            name: Roles_1.Roles.LOVER,
            num: 1
        },
        {
            name: Roles_1.Roles.SHERIFF,
            num: 1
        },
        {
            name: Roles_1.Roles.MAFIA,
            num: 1
        },
        {
            name: Roles_1.Roles.DON,
            num: 1
        },
        {
            name: Roles_1.Roles.MANIAC,
            num: 1
        },
    ],
    // Для 11 игроков
    [
        {
            name: Roles_1.Roles.CIVILIAN,
            num: 5
        },
        {
            name: Roles_1.Roles.LOVER,
            num: 1
        },
        {
            name: Roles_1.Roles.SHERIFF,
            num: 1
        },
        {
            name: Roles_1.Roles.MAFIA,
            num: 2
        },
        {
            name: Roles_1.Roles.DON,
            num: 1
        },
        {
            name: Roles_1.Roles.MANIAC,
            num: 1
        },
    ],
    // Для 12 игроков
    [
        {
            name: Roles_1.Roles.CIVILIAN,
            num: 6
        },
        {
            name: Roles_1.Roles.LOVER,
            num: 1
        },
        {
            name: Roles_1.Roles.SHERIFF,
            num: 1
        },
        {
            name: Roles_1.Roles.MAFIA,
            num: 2
        },
        {
            name: Roles_1.Roles.DON,
            num: 1
        },
        {
            name: Roles_1.Roles.MANIAC,
            num: 1
        },
    ],
    // Для 13 игроков
    [
        {
            name: Roles_1.Roles.CIVILIAN,
            num: 5
        },
        {
            name: Roles_1.Roles.LOVER,
            num: 1
        },
        {
            name: Roles_1.Roles.SHERIFF,
            num: 1
        },
        {
            name: Roles_1.Roles.MAFIA,
            num: 3
        },
        {
            name: Roles_1.Roles.DON,
            num: 1
        },
        {
            name: Roles_1.Roles.MANIAC,
            num: 1
        },
        {
            name: Roles_1.Roles.DOCTOR,
            num: 1
        },
    ],
    // Для 14 игроков
    [
        {
            name: Roles_1.Roles.CIVILIAN,
            num: 6
        },
        {
            name: Roles_1.Roles.LOVER,
            num: 1
        },
        {
            name: Roles_1.Roles.SHERIFF,
            num: 1
        },
        {
            name: Roles_1.Roles.MAFIA,
            num: 3
        },
        {
            name: Roles_1.Roles.DON,
            num: 1
        },
        {
            name: Roles_1.Roles.MANIAC,
            num: 1
        },
        {
            name: Roles_1.Roles.DOCTOR,
            num: 1
        },
    ],
    // Для 15 игроков
    [
        {
            name: Roles_1.Roles.CIVILIAN,
            num: 7
        },
        {
            name: Roles_1.Roles.LOVER,
            num: 1
        },
        {
            name: Roles_1.Roles.SHERIFF,
            num: 1
        },
        {
            name: Roles_1.Roles.MAFIA,
            num: 3
        },
        {
            name: Roles_1.Roles.DON,
            num: 1
        },
        {
            name: Roles_1.Roles.MANIAC,
            num: 1
        },
        {
            name: Roles_1.Roles.DOCTOR,
            num: 1
        }
    ]
];
exports.rolesLine = [
    Roles_1.Roles.LOVER,
    Roles_1.Roles.MAFIA,
    Roles_1.Roles.DON,
    Roles_1.Roles.SHERIFF,
    Roles_1.Roles.DOCTOR,
    Roles_1.Roles.MANIAC,
];
exports.roles = [
    Roles_1.Roles.LOVER,
    Roles_1.Roles.SHERIFF,
    Roles_1.Roles.MAFIA,
    Roles_1.Roles.DON,
    Roles_1.Roles.MANIAC,
    Roles_1.Roles.DOCTOR,
    Roles_1.Roles.CIVILIAN,
];
