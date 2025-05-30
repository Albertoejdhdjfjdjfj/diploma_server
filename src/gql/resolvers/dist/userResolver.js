"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var User_1 = require("../../assets/models/User");
var validator = require("validator");
var bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
require('dotenv').config();
var ACCESS_SECRET = process.env.ACCESS_SECRET;
var userResolver = {
    Query: {
        getUserInfo: function (_, args) { return __awaiter(void 0, void 0, void 0, function () {
            var id, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = args.id;
                        return [4 /*yield*/, User_1.UserModel.findById(id)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('User does not exist');
                        }
                        return [2 /*return*/, user];
                }
            });
        }); },
        userLogIn: function (_, args) { return __awaiter(void 0, void 0, void 0, function () {
            var email, password, user, validPassword, token, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        email = args.email, password = args.password;
                        return [4 /*yield*/, User_1.UserModel.findOne({ email: email })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('Profile does not exist');
                        }
                        validPassword = bcrypt.compareSync(password, user.password);
                        if (!validPassword) {
                            throw new Error('Incorrect password');
                        }
                        token = jwt.sign({
                            userId: user.id,
                            email: email,
                            nickname: user.nickname
                        }, ACCESS_SECRET);
                        return [2 /*return*/, { user: user, token: "Bearer " + token }];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error(error_1.message);
                    case 3: return [2 /*return*/];
                }
            });
        }); }
    },
    Mutation: {
        userSignUp: function (_, args) { return __awaiter(void 0, void 0, void 0, function () {
            var nickname, email, password, existingUser, hashedPassword, newUser, savedUser, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        nickname = args.nickname, email = args.email, password = args.password;
                        return [4 /*yield*/, User_1.UserModel.findOne({
                                $or: [{ nickname: nickname }, { email: email }]
                            })];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser) {
                            throw new Error('Nickname or email already in use');
                        }
                        return [4 /*yield*/, bcrypt.hash(password, 10)];
                    case 2:
                        hashedPassword = _a.sent();
                        newUser = new User_1.UserModel(__assign(__assign({}, args), { password: hashedPassword }));
                        return [4 /*yield*/, newUser.save()];
                    case 3:
                        savedUser = _a.sent();
                        return [2 /*return*/, savedUser];
                    case 4:
                        error_2 = _a.sent();
                        throw new Error(error_2.message);
                    case 5: return [2 /*return*/];
                }
            });
        }); }
    }
};
module.exports = userResolver;
